using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using JSTestat.Service.Data;
using JSTestat.Service.Util;

namespace JSTestat.Service
{
    [WebService(Description = "Web services to access the chat server. All public methods are synchronised!", Namespace = "http://www.hsr.ch/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [ScriptService]
    public class ChatService
    {
        private const string PersistChatName = "IntTe";
        private static readonly List<Chat> ChatLobby = new List<Chat>() { new Chat(PersistChatName) };
        private static readonly List<Player> AllPlayers = new List<Player>();
        private static readonly List<Player> RegisteredPlayers = new List<Player>() { new Player("testuser", "1234", Guid.NewGuid().ToString()) };

        [WebMethod(EnableSession = true, Description = "Connects to the server and returns a playerToken.")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public string Connect()
        {
            string playerToken = HttpContext.Current.Session.SessionID; // only one user per session
            //string playerToken = Guid.NewGuid().ToString(); // multiple user per session
            var player = AllPlayers.FirstOrDefault(x => x.PlayerToken == playerToken) ?? new Player(playerToken, HttpContext.Current.Session.SessionID);

            AllPlayers.Add(player);
            return playerToken;
        }

        [WebMethod(EnableSession = true, Description = "Logs in")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public string Login(string playername, string password)
        {
            var player =
                (from p in RegisteredPlayers where p.Password == password && p.PlayerName == playername select p).
                    FirstOrDefault();
            string playerToken = string.Empty;

            if (player != null)
            {
                playerToken = HttpContext.Current.Session.SessionID;
                player.PlayerToken = playerToken;
                AllPlayers.Add(player);
            }
            return playerToken;
        }

        [WebMethod(EnableSession = true, Description = "Logs in")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public bool IsLoggedIn()
        {
            var player =
                (from p in AllPlayers where p.PlayerToken == HttpContext.Current.Session.SessionID select p).
                    FirstOrDefault();

            return player != null;
        }


        [WebMethod(Description = "Player joins the given chat")]
        [ScriptMethod]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public void JoinChat(string playerToken, string chatId, string userName)
        {
            PreCondition.AssertNotNullOrEmpty(playerToken, "playerToken");
            PreCondition.AssertNotNullOrEmpty(chatId, "chatId");
            PreCondition.AssertNotNullOrEmpty(userName, "userName");

            SetName(playerToken, userName);
            GetChat(chatId).AddPlayer(GetPlayer(playerToken));
        }


        [WebMethod(Description = "Player leaves his current chat")]
        [ScriptMethod]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public void LeaveChat(string playerToken)
        {
            PreCondition.AssertNotNullOrEmpty(playerToken, "playerToken");

            var chat = GetAndCheckChat(playerToken);
            chat.RemovePlayer(playerToken);
        }


        [WebMethod(Description = "Stores a new message into the current chat. ")]
        [ScriptMethod]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public void WriteLine(string playerToken, string text)
        {
            PreCondition.AssertNotNullOrEmpty(playerToken, "playerToken");
            PreCondition.AssertNotNullOrEmpty(text, "text");

            var chat = GetAndCheckChat(playerToken);
            chat.AddLine(playerToken, text);
        }

        [WebMethod(Description = "Gets all new chat lines for the given player. Returns each message only once.")]
        [ScriptMethod]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public List<ChatLine> GetLinesFrom(string playerToken)
        {
            PreCondition.AssertNotNullOrEmpty(playerToken, "playerToken");
            var chat = GetAndCheckChat(playerToken);

            var player = chat.GetPlayer(playerToken);
            var list = chat.ChatLines.Where(x => x.Tick > player.Tick).ToList();
            player.Tick = chat.ChatLines.Last().Tick;
            return list;
        }

        [WebMethod(Description = "Checks if the given user name unqiue. ")]
        [ScriptMethod]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public bool IsNameUnique(string name)
        {
            var players = from x in ChatLobby
                          from y in x.Players
                          select y;

            //players = players.Union(AllPlayers);  //check names only in the chats. Players not assigned to a room can have the same name.
            return players.FirstOrDefault(x => x.PlayerName == name) == null;
        }

        [WebMethod(Description = "Gets all player assigned to the given chatId")]
        [ScriptMethod]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public List<Player> GetPlayers(string chatId)
        {
            PreCondition.AssertNotNullOrEmpty(chatId, "chatId");
            return GetChat(chatId).Players;
        }

        [WebMethod(Description = "Gets all chat room on this server")]
        [ScriptMethod]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public Chat[] GetChats()
        {
            return ChatLobby.ToArray();
        }


        [WebMethod(Description = "Get the chat from the given chat id")]
        [ScriptMethod]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public Chat GetChat(string chatId)
        {
            PreCondition.AssertNotNullOrEmpty(chatId, "chatId");
            return ChatLobby.First(x => x.Id == chatId);
        }


        [WebMethod(Description = "Creates a new channel.")]
        [ScriptMethod]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public string CreateChannel(string playerToken, string channelName)
        {
            PreCondition.AssertNotNullOrEmpty(channelName, "channelName");
            PreCondition.AssertNotNullOrEmpty(playerToken, "playerToken");
            CheckPlayerToken(playerToken);

            var chat = ChatLobby.FirstOrDefault(x => x.Name == channelName); ;
            if (chat == null)
            {
                chat = new Chat(channelName);
                ChatLobby.Add(chat);
            }
            return chat.Id;
        }

        [WebMethod(Description = "Creates a new Player.")]
        [ScriptMethod]
        [MethodImpl(MethodImplOptions.Synchronized)]
        public string CreatePlayer(string playerName, string password)
        {
            PreCondition.AssertNotNullOrEmpty(playerName, "playerName");
            PreCondition.AssertNotNullOrEmpty(password, "password");

            var player = RegisteredPlayers.FirstOrDefault(x => x.PlayerName == playerName);
            if (player == null)
            {
                player = new Player(playerName, password, Guid.NewGuid().ToString());
                RegisteredPlayers.Add(player);
            }
            return player.Id;
        }


        /// <summary>
        /// This method removes all player assigned to the given session id. 
        /// Also it removes not used chat rooms
        /// </summary>
        /// <param name="sessionId"></param>
        [MethodImpl(MethodImplOptions.Synchronized)]
        static internal void RemoveUserFromSessionId(string sessionId)
        {
            foreach (var chat in ChatLobby)
            {
                chat.Players.RemoveAll(x => x.Id == sessionId);
            }

            AllPlayers.RemoveAll(x => x.Id == sessionId);

            if (ChatLobby.Count > 3)
            {
                //delete all chats with no players where older than 3 minutes 
                ChatLobby.RemoveAll(x => x.Players.Count == 0 && x.Name != PersistChatName && x.LastUse.AddMinutes(3) < DateTime.Now);
            }

        }

        #region helper methods
        private Chat GetAndCheckChat(string playerToken)
        {
            var chat = GetChatForPlayer(playerToken);
            if (chat == null)
            {
                throw new InvalidOperationException("User is not assigned to a chat");
            }
            return chat;
        }

        private Chat GetChatForPlayer(string playerToken)
        {
            return ChatLobby.FirstOrDefault(x => x.Players.FirstOrDefault(y => y.PlayerToken == playerToken) != null);
        }


        private void CheckPlayerToken(string playerToken)
        {
            GetPlayer(playerToken);
        }

        private Player GetPlayer(string playerToken)
        {
            return AllPlayers.First(x => x.PlayerToken == playerToken);
        }

        private void SetName(string playerToken, string name)
        {
            var player = GetPlayer(playerToken);
            player.PlayerName = name;
        }

        #endregion
    }
}
