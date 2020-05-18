using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YetAnotherRetroRegulator.Types;

namespace YetAnotherRetroRegulator.Data
{
	public class RetroData
	{
		public DateTime LastPublished;

		public int AvailableVotes = 3;
		public string[] Areas = { };
		public RetroItem[] Items = { };
	}
}
