using System;
using System.Collections.Generic;

namespace JSTestat.Service.Data
{
 

    [Serializable]
    public class ChatLine
    {
        public long Tick { get; set; }
        public Player Player { get; set; }
        public string Text { get; set; }


        /// <summary>
        /// Only for Serializable
        /// </summary>
        public ChatLine()
        {}

        public ChatLine(Player player, string text)
        {
            Player = player;
            Text = text;
        }
    };
}