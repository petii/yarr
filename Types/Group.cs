using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YetAnotherRetroRegulator.Types
{
  public class Group
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public List<int> Items { get; set; }
  }
}
