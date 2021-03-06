﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using YetAnotherRetroRegulator.Data;
using YetAnotherRetroRegulator.Types;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace YetAnotherRetroRegulator.Controllers
{
  [Route("api/[controller]")]
  public class RetroController : Controller
  {
    private RetroData Retro;
    public RetroController(RetroData retroData)
    {
      Retro = retroData;
    }

    // GET: api/<controller>
    [HttpGet]
    public IEnumerable<string> Get()
    {
      return new string[] { "hello", ",", "world" };
    }

    [Route("lastupdate")]
    [HttpGet]
    public /*async*/ DateTime GetLastPublished()
    {
      return Retro.LastPublished;
    }

    [Route("setup")]
    [HttpGet]
    public /*async*/ RetroSetup GetSetup()
    {
      return new RetroSetup() { Areas = Retro.Areas.ToArray(), Votes = Retro.AvailableVotes };
    }

    [Route("setup")]
    [HttpPost]
    public /*async*/ ActionResult<RetroSetup> PutSetup([FromBody] RetroSetup value)
    {
      Retro.Reset();
      Retro.Areas = value.Areas.ToList();
      Retro.AvailableVotes = value.Votes;
      return value;
    }

    [Route("publish")]
    [HttpPost]
    public /*async*/ ActionResult<RetroItem> PublishItem([FromBody] RetroItem value)
    {
      value.Id = Retro.Items.Count;
      Retro.Items.Add(value);
      Retro.LastPublished = DateTime.Now;
      return value;
    }

    [Route("items")]
    [HttpGet]
    public /*async*/ Update GetItems()
    {
      return new Update(Retro.LastPublished, Retro.Items.ToArray());
    }

    [Route("items")]
    [HttpPatch]
    public /*async*/ bool SetGroup([FromBody] RetroItem[] items)
    {
      foreach (RetroItem data in items)
      {
        if (data.Group != null && data.Group.Id == null)
        {
          data.Group.Id = Retro.Groups.Count + 1;
          Retro.Groups.Add(data.Group);
        }
        else if (data.Group != null)
        {
          Retro.Groups.Find(item => item.Id == data.Group.Id).Name = data.Group.Name;
        }
        Retro.Items.Find(item => item.Id == data.Id).Group = data.Group;
      }
      Retro.LastPublished = DateTime.Now;
      return true;
    }

    [Route("vote")]
    [HttpPost]
    public /*async*/ int[] Vote([FromBody] int[] votes)
    {
      Retro.Votes.AddRange(votes);
      Retro.LastPublished = DateTime.Now;
      return votes;
    }

    [Route("votes")]
    [HttpGet]
    public /*async*/ VoteUpdate GetVotes()
    {
      var data = new VoteUpdate();
      data.Timestamp = Retro.LastPublished;
      data.Votes = Retro.Votes.ToArray();
      return data;
    }
  }
}
