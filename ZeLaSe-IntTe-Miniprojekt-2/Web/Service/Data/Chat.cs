using System;
using System.Collections.Generic;
using System.Linq;

namespace JSTestat.Service.Data
{

    [Serializable]
    public class Chat
    {
        public string Name { get; private set; }
        public List<Player> Players { get; private set; }
        public List<ChatLine> ChatLines { get; private set; }
        public string Id { get; private set; }
        public DateTime LastUse { get; private set; }
        private int _chatLines = 0;
      
        public Chat()
        {
            Players = new List<Player>();
            ChatLines = new List<ChatLine>();
            Id = Guid.NewGuid().ToString();
            LastUse = DateTime.Now;
        }


        public Chat(string name) :  this()
        {
            Name = name;
        }

        public void AddLine(string playerToken, string text)
        {
            var player = Players.FirstOrDefault(x => x.PlayerToken == playerToken);
            if(player == null)
            {
                throw new ArgumentException("Given player is not in the given chat");
            }
            _chatLines = ++_chatLines;
            ChatLines.Add(new ChatLine(player,text){Tick = _chatLines});
            LastUse = DateTime.Now;
        }

        public void AddPlayer(Player player)
        {
            Players.Add(player);
            LastUse = DateTime.Now;
        }


        public void RemovePlayer(string playerToken)
        {
            var player= Players.FirstOrDefault(x => x.PlayerToken == playerToken);
            if (player != null)
            {
                player.Tick = 0;
                Players.Remove(player);
            }
        }


        public Player GetPlayer(string playerToken)
        {
            return Players.FirstOrDefault(x => x.PlayerToken == playerToken);
        }
    };
}