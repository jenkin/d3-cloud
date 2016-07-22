var $ = require("jquery"),
    d3 = require("d3"),
    cloud = require("../");

var w = $("body").width(),
    h = $("body").height();

var sc = d3.scale.category10(),
    sl = d3.scale.linear();

var words = ["i","me","my","myself","we","us","our","ours","ourselves","you","your","yours","yourself","yourselves","he","him","his","himself","she","her","hers","herself","it","its","itself","they","them","their","theirs","themselves","what","which","who","whom","whose","this","that","these","those","am","is","are","was","were","be","been","being","have","has","had","having","do","does","did","doing","will","would","should","can","could","ought","i'm","you're","he's","she's","it's","we're","they're","i've","you've","we've","they've","i'd","you'd","he'd","she'd","we'd","they'd","i'll","you'll","he'll","she'll","we'll","they'll","isn't","aren't","wasn't","weren't","hasn't","haven't","hadn't","doesn't","don't","didn't","won't","wouldn't","shan't","shouldn't","can't","cannot","couldn't","mustn't","let's","that's","who's","what's","here's","there's","when's","where's","why's","how's","a","an","the","and","but","if","or","because","as","until","while","of","at","by","for","with","about","against","between","into","through","during","before","after","above","below","to","from","up","upon","down","in","out","on","off","over","under","again","further","then","once","here","there","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","say","says","said","shall"];

var layout = cloud()
    .size([w, h])
    .words(words.map(function(d,i) {
      var m = function(n) { return Math.random() < .5 ? n-1 : 1; },
          n = 4,
          c = [m(n),m(n)];
      return {
        text: d,
        value: Math.random() * 500,
        center: [c[0]*w/n,c[1]*h/n],
        cluster: ""+c[0]+c[1]
      };
    }))
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 2) * 15; })
    .font("Impact")
    //.fontSize(function(d) { return Math.log(d.value)+10; })
    .on("end", draw);

layout.start();

function draw(words) {
  sl.domain(d3.extent(words.map(function(w) { return w.size; }))).range([5,30]);
  sc.domain(d3.map(words, function(w) { return w.cluster; }).keys());
  d3.select("body").append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d) { return sc(d.cluster); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; })
      .append("title")
      .text(function(d) { return d.text; });
}
