using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YetAnotherRetroRegulator.Types
{
  public class VoteUpdate
  {
    public DateTime Timestamp { get; set; }
    public int[] Votes { get; set; }
  }
}
