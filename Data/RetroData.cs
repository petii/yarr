using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YetAnotherRetroRegulator.Types;

namespace YetAnotherRetroRegulator.Data
{
  public class RetroData
  {
    public RetroData()
    {
      Reset();
    }
    public void Reset()
    {
      Started = false;
      LastPublished = DateTime.Now;
      Areas = new List<string>();
      Items = new List<RetroItem>();
      Groups = new List<GroupType>();
      AvailableVotes = 0;
      Votes = new List<int>();
    }

    public bool Started { get; set; }

    public DateTime LastPublished { get; set; }

    public List<string> Areas { get; set; }
    public List<RetroItem> Items { get; set; }

    public DateTime LastGroupChange { get; set; }
    public List<GroupType> Groups { get; set; }

    public DateTime LastVoted { get; set; }
    public int AvailableVotes { get; set; }

    public List<int> Votes { get; set; }
  }
}
