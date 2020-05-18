using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YetAnotherRetroRegulator.Types;

namespace YetAnotherRetroRegulator.Data
{
	public class RetroData
	{
		public DateTime LastPublished = DateTime.Now;

		public int AvailableVotes = 3;
		public string[] Areas = { };
		public List<RetroItem> Items = new List<RetroItem> { };
	}
}
