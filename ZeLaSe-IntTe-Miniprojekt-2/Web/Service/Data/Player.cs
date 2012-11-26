using System;

namespace JSTestat.Service.Data
{
    [Serializable]
    public class Player
    {
        public string PlayerToken { get; set; }
        public string PlayerName { get; set; }
        public long Tick { get; set; }
        public string Id { get; set; }
        public string Password { get; set; }

         /// <summary>
        /// Only for Serializable
        /// </summary>
        public Player()
        {}

        public Player(string token, string id)
        {
            PlayerToken = token;
            Tick = 0;
            Id = id;
        }

        public Player(string playername, string password, string id)
        {
            PlayerName = playername;
            Password = password;
            PlayerToken = string.Empty;
            Tick = 0;
            Id = id;
        }
    }
}