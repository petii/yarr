using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YetAnotherRetroRegulator.Types
{
    public class Update
    {
        public Update(DateTime time, RetroItem[] items) { Timestamp = time; Items = items; }
        public DateTime Timestamp { get; set; }
        public RetroItem[] Items { get; set; }
    }
}
