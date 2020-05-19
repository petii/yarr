using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YetAnotherRetroRegulator.Types
{
  public class RetroItem
  {
    public int Id { get; set; }
    public string Area { get; set; }
    public string Text { get; set; }

    public GroupType Group { get; set; }

  }
}
