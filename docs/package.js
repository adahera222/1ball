(function(pkg) {
  // Expose a require for our package so scripts can access our modules
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "mode": "100644",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "mode": "100644",
      "content": "1ine\n====\n\nYou have but one line to live.\n",
      "type": "blob"
    },
    "lib/util.coffee.md": {
      "path": "lib/util.coffee.md",
      "mode": "100644",
      "content": "Util\n====\n\nDeferred\n--------\n\nUse jQuery deferred\n\n    global.Deferred = jQuery.Deferred\n\nHelpers\n-------\n\n    isObject = (object) ->\n      Object::toString.call(object) is \"[object Object]\"\n\nSize\n----\n\nA 2d extent.\n\n    Size = (width, height) ->\n      if isObject(width)\n        {width, height} = width\n\n      width: width\n      height: height\n      __proto__: Size.prototype\n\n    Size.prototype =\n      scale: (scalar) ->\n        Size(@width * scalar, @height * scalar)\n\n      toString: ->\n        \"Size(#{@width}, #{@height})\"\n\n      each: (iterator) ->\n        [0...@height].forEach (y) ->\n          [0...@width].forEach (x) ->\n            iterator(x, y)\n\nBounds\n------\n\n    Bounds = ({x, y}, {width, height}) ->\n      x: x\n      y: y\n      width: width\n      height: height\n\n    Bounds.prototype =\n      toString: ->\n        \"Bounds({#{@x}, #{@y}}, {#{@width}, #{@height}})\"\n\nPoint Extensions\n----------------\n\n    Point.prototype.scale = (scalar) ->\n      if isObject(scalar)\n        Point(@x * scalar.width, @y * scalar.height)\n      else\n        Point(@x * scalar, @y * scalar)\n\n    Point.prototype.sign = ->\n      Point(@x.sign(), @y.sign())\n\nExtra utilities that may be broken out into separate libraries.\n\n    module.exports =\n      Bounds: Bounds\n      Size: Size\n",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "mode": "100644",
      "content": "1ball\n====\n\nDraw one line.\n\n    require \"./setup\"\n    Canvas = require \"touch-canvas\"\n    Compositions = require \"./lib/compositions\"\n    {Size, Bounds} = require \"./lib/util\"\n\n    FPS = 60\n    dt = 1/FPS\n\n    size = Size\n      width: 1024\n      height: 576\n\n    canvas = Canvas size\n\n    Ball = (I={}, self=Core(I)) ->\n      Object.defaults I,\n        color: \"blue\"\n        position:\n          x: 0\n          y: 0\n        velocity:\n          x: 0\n          y: 0\n        radius: 64\n\n      self.include Compositions\n\n      self.attrModel \"position\", Point\n      self.attrModel \"velocity\", Point\n\n      self.extend\n        draw: (canvas) ->\n          p = self.position()\n          canvas.drawCircle\n            x: p.x\n            y: p.y\n            color: I.color\n            radius: I.radius\n\n        update: ->\n          self.position(self.position().add(self.velocity().scale(dt)))\n\n      return self\n\n    $(\"body\").append canvas.element()\n\n    startPosition = null\n    currentPosition = null\n    canvas.on \"touch\", (position) ->\n      startPosition = currentPosition = position.scale(size)\n\n    canvas.on \"move\", (position) ->\n      currentPosition = position.scale(size)\n\n    canvas.on \"release\", (position) ->\n      currentPosition = position.scale(size)\n\n      fire startPosition, currentPosition\n\n      startPosition = currentPosition = null\n\n    ball = null\n\n    update = ->\n      ball?.update()\n\n    fire = (start, target) ->\n      ball = Ball\n        position: start\n        velocity: target.subtract(start).norm getPower(start, target) * 1600\n\n    getPower = (a, b) ->\n      p = Point.distance(a, b) / 200\n      \n      p.clamp 0, 1\n\n    draw = ->\n      canvas.fill(\"red\")\n\n      if startPosition\n        power = getPower(startPosition, currentPosition)\n        \n        canvas.drawCircle\n          x: startPosition.x\n          y: startPosition.y\n          color: \"blue\"\n          radius: 64\n\n        canvas.drawLine\n          start: startPosition\n          end: currentPosition\n          color: \"black\"\n        \n        fontSize = 32 + 6 * Math.sin(t * 1.5 * Math.TAU)\n        canvas.font \"#{fontSize}px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif\"\n        canvas.centerText\n          color: \"white\"\n          position: currentPosition\n          text: (power * 100).toFixed(2)\n\n      if ball\n        ball.draw canvas\n\n    t = 0\n    setInterval ->\n      update()\n      draw()\n      t += dt\n    , dt * 1000\n",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "mode": "100644",
      "content": "remoteDependencies: [\n  \"https://code.jquery.com/jquery-1.10.1.min.js\"\n  \"http://strd6.github.io/tempest/javascripts/envweb-v0.4.5.js\"\n]\ndependencies:\n  appcache: \"distri/appcache:v0.2.0\"\n  runtime: \"STRd6/runtime:v0.2.0\"\n  \"touch-canvas\": \"distri/touch-canvas:v0.3.0\"\nwidth: 1024\nheight: 576\n",
      "type": "blob"
    },
    "setup.coffee.md": {
      "path": "setup.coffee.md",
      "mode": "100644",
      "content": "Setup\n=====\n\nSet up our runtime styles and expose some stuff for debugging.\n\n    # For debug purposes\n    global.PACKAGE = PACKAGE\n    global.require = require\n\n    runtime = require(\"runtime\")(PACKAGE)\n    runtime.boot()\n    runtime.applyStyleSheet(require('./style'))\n\n    # Updating Application Cache and prompting for new version\n    require \"appcache\"\n",
      "type": "blob"
    },
    "style.styl": {
      "path": "style.styl",
      "mode": "100644",
      "content": "body\n  margin: 0\n  overflow: hidden\n",
      "type": "blob"
    },
    "lib/compositions.coffee.md": {
      "path": "lib/compositions.coffee.md",
      "mode": "100644",
      "content": "Compositions\n============\n\nThe compositions module provides helper methods to compose nested data models.\n\nCompositions uses observables to keep the internal data in sync.\n\n    module.exports = (I={}, self=Core(I)) ->\n\n      self.extend\n\nObserve any number of attributes as simple observables. For each attribute name passed in we expose a public getter/setter method and listen to changes when the value is set.\n\n        attrObservable: (names...) ->\n          names.each (name) ->\n            self[name] = Observable(I[name])\n\n            self[name].observe (newValue) ->\n              I[name] = newValue\n\n          return self\n\nObserve an attribute as a model. Treats the attribute given as an Observable\nmodel instance exposting a getter/setter method of the same name. The Model\nconstructor must be passed in explicitly.\n\n        attrModel: (name, Model) ->\n          model = Model(I[name])\n\n          self[name] = Observable(model)\n\n          self[name].observe (newValue) ->\n            I[name] = newValue.I\n\n          return self\n\nObserve an attribute as a list of sub-models. This is the same as `attrModel`\nexcept the attribute is expected to be an array of models rather than a single one.\n\n        attrModels: (name, Model) ->\n          models = (I[name] or []).map (x) ->\n            Model(x)\n\n          self[name] = Observable(models)\n\n          self[name].observe (newValue) ->\n            I[name] = newValue.map (instance) ->\n              instance.I\n\n          return self\n\nThe JSON representation is kept up to date via the observable properites and resides in `I`.\n\n        toJSON: ->\n          I\n\nReturn our public object.\n\n      return self\n",
      "type": "blob"
    }
  },
  "distribution": {
    "lib/util": {
      "path": "lib/util",
      "content": "(function() {\n  var Bounds, Size, isObject;\n\n  global.Deferred = jQuery.Deferred;\n\n  isObject = function(object) {\n    return Object.prototype.toString.call(object) === \"[object Object]\";\n  };\n\n  Size = function(width, height) {\n    var _ref;\n    if (isObject(width)) {\n      _ref = width, width = _ref.width, height = _ref.height;\n    }\n    return {\n      width: width,\n      height: height,\n      __proto__: Size.prototype\n    };\n  };\n\n  Size.prototype = {\n    scale: function(scalar) {\n      return Size(this.width * scalar, this.height * scalar);\n    },\n    toString: function() {\n      return \"Size(\" + this.width + \", \" + this.height + \")\";\n    },\n    each: function(iterator) {\n      var _i, _ref, _results;\n      return (function() {\n        _results = [];\n        for (var _i = 0, _ref = this.height; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(function(y) {\n        var _i, _ref, _results;\n        return (function() {\n          _results = [];\n          for (var _i = 0, _ref = this.width; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }\n          return _results;\n        }).apply(this).forEach(function(x) {\n          return iterator(x, y);\n        });\n      });\n    }\n  };\n\n  Bounds = function(_arg, _arg1) {\n    var height, width, x, y;\n    x = _arg.x, y = _arg.y;\n    width = _arg1.width, height = _arg1.height;\n    return {\n      x: x,\n      y: y,\n      width: width,\n      height: height\n    };\n  };\n\n  Bounds.prototype = {\n    toString: function() {\n      return \"Bounds({\" + this.x + \", \" + this.y + \"}, {\" + this.width + \", \" + this.height + \"})\";\n    }\n  };\n\n  Point.prototype.scale = function(scalar) {\n    if (isObject(scalar)) {\n      return Point(this.x * scalar.width, this.y * scalar.height);\n    } else {\n      return Point(this.x * scalar, this.y * scalar);\n    }\n  };\n\n  Point.prototype.sign = function() {\n    return Point(this.x.sign(), this.y.sign());\n  };\n\n  module.exports = {\n    Bounds: Bounds,\n    Size: Size\n  };\n\n}).call(this);\n\n//# sourceURL=lib/util.coffee",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var Ball, Bounds, Canvas, Compositions, FPS, Size, ball, canvas, currentPosition, draw, dt, fire, getPower, size, startPosition, t, update, _ref;\n\n  require(\"./setup\");\n\n  Canvas = require(\"touch-canvas\");\n\n  Compositions = require(\"./lib/compositions\");\n\n  _ref = require(\"./lib/util\"), Size = _ref.Size, Bounds = _ref.Bounds;\n\n  FPS = 60;\n\n  dt = 1 / FPS;\n\n  size = Size({\n    width: 1024,\n    height: 576\n  });\n\n  canvas = Canvas(size);\n\n  Ball = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    Object.defaults(I, {\n      color: \"blue\",\n      position: {\n        x: 0,\n        y: 0\n      },\n      velocity: {\n        x: 0,\n        y: 0\n      },\n      radius: 64\n    });\n    self.include(Compositions);\n    self.attrModel(\"position\", Point);\n    self.attrModel(\"velocity\", Point);\n    self.extend({\n      draw: function(canvas) {\n        var p;\n        p = self.position();\n        return canvas.drawCircle({\n          x: p.x,\n          y: p.y,\n          color: I.color,\n          radius: I.radius\n        });\n      },\n      update: function() {\n        return self.position(self.position().add(self.velocity().scale(dt)));\n      }\n    });\n    return self;\n  };\n\n  $(\"body\").append(canvas.element());\n\n  startPosition = null;\n\n  currentPosition = null;\n\n  canvas.on(\"touch\", function(position) {\n    return startPosition = currentPosition = position.scale(size);\n  });\n\n  canvas.on(\"move\", function(position) {\n    return currentPosition = position.scale(size);\n  });\n\n  canvas.on(\"release\", function(position) {\n    currentPosition = position.scale(size);\n    fire(startPosition, currentPosition);\n    return startPosition = currentPosition = null;\n  });\n\n  ball = null;\n\n  update = function() {\n    return ball != null ? ball.update() : void 0;\n  };\n\n  fire = function(start, target) {\n    return ball = Ball({\n      position: start,\n      velocity: target.subtract(start).norm(getPower(start, target) * 1600)\n    });\n  };\n\n  getPower = function(a, b) {\n    var p;\n    p = Point.distance(a, b) / 200;\n    return p.clamp(0, 1);\n  };\n\n  draw = function() {\n    var fontSize, power;\n    canvas.fill(\"red\");\n    if (startPosition) {\n      power = getPower(startPosition, currentPosition);\n      canvas.drawCircle({\n        x: startPosition.x,\n        y: startPosition.y,\n        color: \"blue\",\n        radius: 64\n      });\n      canvas.drawLine({\n        start: startPosition,\n        end: currentPosition,\n        color: \"black\"\n      });\n      fontSize = 32 + 6 * Math.sin(t * 1.5 * Math.TAU);\n      canvas.font(\"\" + fontSize + \"px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif\");\n      canvas.centerText({\n        color: \"white\",\n        position: currentPosition,\n        text: (power * 100).toFixed(2)\n      });\n    }\n    if (ball) {\n      return ball.draw(canvas);\n    }\n  };\n\n  t = 0;\n\n  setInterval(function() {\n    update();\n    draw();\n    return t += dt;\n  }, dt * 1000);\n\n}).call(this);\n\n//# sourceURL=main.coffee",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"remoteDependencies\":[\"https://code.jquery.com/jquery-1.10.1.min.js\",\"http://strd6.github.io/tempest/javascripts/envweb-v0.4.5.js\"],\"dependencies\":{\"appcache\":\"distri/appcache:v0.2.0\",\"runtime\":\"STRd6/runtime:v0.2.0\",\"touch-canvas\":\"distri/touch-canvas:v0.3.0\"},\"width\":1024,\"height\":576};",
      "type": "blob"
    },
    "setup": {
      "path": "setup",
      "content": "(function() {\n  var runtime;\n\n  global.PACKAGE = PACKAGE;\n\n  global.require = require;\n\n  runtime = require(\"runtime\")(PACKAGE);\n\n  runtime.boot();\n\n  runtime.applyStyleSheet(require('./style'));\n\n  require(\"appcache\");\n\n}).call(this);\n\n//# sourceURL=setup.coffee",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"body {\\n  margin: 0;\\n  overflow: hidden;\\n}\";",
      "type": "blob"
    },
    "lib/compositions": {
      "path": "lib/compositions",
      "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    self.extend({\n      attrObservable: function() {\n        var names;\n        names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        names.each(function(name) {\n          self[name] = Observable(I[name]);\n          return self[name].observe(function(newValue) {\n            return I[name] = newValue;\n          });\n        });\n        return self;\n      },\n      attrModel: function(name, Model) {\n        var model;\n        model = Model(I[name]);\n        self[name] = Observable(model);\n        self[name].observe(function(newValue) {\n          return I[name] = newValue.I;\n        });\n        return self;\n      },\n      attrModels: function(name, Model) {\n        var models;\n        models = (I[name] || []).map(function(x) {\n          return Model(x);\n        });\n        self[name] = Observable(models);\n        self[name].observe(function(newValue) {\n          return I[name] = newValue.map(function(instance) {\n            return instance.I;\n          });\n        });\n        return self;\n      },\n      toJSON: function() {\n        return I;\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=lib/compositions.coffee",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://strd6.github.io/editor/"
  },
  "entryPoint": "main",
  "remoteDependencies": [
    "https://code.jquery.com/jquery-1.10.1.min.js",
    "http://strd6.github.io/tempest/javascripts/envweb-v0.4.5.js"
  ],
  "repository": {
    "id": 15178433,
    "name": "1ball",
    "full_name": "STRd6/1ball",
    "owner": {
      "login": "STRd6",
      "id": 18894,
      "avatar_url": "https://gravatar.com/avatar/33117162fff8a9cf50544a604f60c045?d=https%3A%2F%2Fidenticons.github.com%2F39df222bffe39629d904e4883eabc654.png&r=x",
      "gravatar_id": "33117162fff8a9cf50544a604f60c045",
      "url": "https://api.github.com/users/STRd6",
      "html_url": "https://github.com/STRd6",
      "followers_url": "https://api.github.com/users/STRd6/followers",
      "following_url": "https://api.github.com/users/STRd6/following{/other_user}",
      "gists_url": "https://api.github.com/users/STRd6/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/STRd6/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/STRd6/subscriptions",
      "organizations_url": "https://api.github.com/users/STRd6/orgs",
      "repos_url": "https://api.github.com/users/STRd6/repos",
      "events_url": "https://api.github.com/users/STRd6/events{/privacy}",
      "received_events_url": "https://api.github.com/users/STRd6/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/STRd6/1ball",
    "description": "You have but one line to live.",
    "fork": false,
    "url": "https://api.github.com/repos/STRd6/1ball",
    "forks_url": "https://api.github.com/repos/STRd6/1ball/forks",
    "keys_url": "https://api.github.com/repos/STRd6/1ball/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/STRd6/1ball/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/STRd6/1ball/teams",
    "hooks_url": "https://api.github.com/repos/STRd6/1ball/hooks",
    "issue_events_url": "https://api.github.com/repos/STRd6/1ball/issues/events{/number}",
    "events_url": "https://api.github.com/repos/STRd6/1ball/events",
    "assignees_url": "https://api.github.com/repos/STRd6/1ball/assignees{/user}",
    "branches_url": "https://api.github.com/repos/STRd6/1ball/branches{/branch}",
    "tags_url": "https://api.github.com/repos/STRd6/1ball/tags",
    "blobs_url": "https://api.github.com/repos/STRd6/1ball/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/STRd6/1ball/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/STRd6/1ball/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/STRd6/1ball/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/STRd6/1ball/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/STRd6/1ball/languages",
    "stargazers_url": "https://api.github.com/repos/STRd6/1ball/stargazers",
    "contributors_url": "https://api.github.com/repos/STRd6/1ball/contributors",
    "subscribers_url": "https://api.github.com/repos/STRd6/1ball/subscribers",
    "subscription_url": "https://api.github.com/repos/STRd6/1ball/subscription",
    "commits_url": "https://api.github.com/repos/STRd6/1ball/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/STRd6/1ball/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/STRd6/1ball/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/STRd6/1ball/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/STRd6/1ball/contents/{+path}",
    "compare_url": "https://api.github.com/repos/STRd6/1ball/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/STRd6/1ball/merges",
    "archive_url": "https://api.github.com/repos/STRd6/1ball/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/STRd6/1ball/downloads",
    "issues_url": "https://api.github.com/repos/STRd6/1ball/issues{/number}",
    "pulls_url": "https://api.github.com/repos/STRd6/1ball/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/STRd6/1ball/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/STRd6/1ball/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/STRd6/1ball/labels{/name}",
    "releases_url": "https://api.github.com/repos/STRd6/1ball/releases{/id}",
    "created_at": "2013-12-14T02:03:24Z",
    "updated_at": "2013-12-14T02:29:16Z",
    "pushed_at": "2013-12-14T02:27:06Z",
    "git_url": "git://github.com/STRd6/1ball.git",
    "ssh_url": "git@github.com:STRd6/1ball.git",
    "clone_url": "https://github.com/STRd6/1ball.git",
    "svn_url": "https://github.com/STRd6/1ball",
    "homepage": null,
    "size": 336,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "CoffeeScript",
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "master_branch": "master",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "network_count": 0,
    "subscribers_count": 1,
    "branch": "master",
    "defaultBranch": "master"
  },
  "dependencies": {
    "appcache": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "appcache\n========\n\nHTML5 AppCache Helpers\n",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "mode": "100644",
          "content": "App Cache\n=========\n\nSome helpers for working with HTML5 application cache.\n\nhttp://www.html5rocks.com/en/tutorials/appcache/beginner/\n\n    applicationCache = window.applicationCache\n\n    applicationCache.addEventListener 'updateready', (e) ->\n      if applicationCache.status is applicationCache.UPDATEREADY\n        # Browser downloaded a new app cache.\n        if confirm('A new version of this site is available. Load it?')\n          window.location.reload()\n    , false\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "version: \"0.2.0\"\nentryPoint: \"main\"\n",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var applicationCache;\n\n  applicationCache = window.applicationCache;\n\n  applicationCache.addEventListener('updateready', function(e) {\n    if (applicationCache.status === applicationCache.UPDATEREADY) {\n      if (confirm('A new version of this site is available. Load it?')) {\n        return window.location.reload();\n      }\n    }\n  }, false);\n\n}).call(this);\n\n//# sourceURL=main.coffee",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"main\"};",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.2.0",
      "entryPoint": "main",
      "repository": {
        "id": 14539483,
        "name": "appcache",
        "full_name": "distri/appcache",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/appcache",
        "description": "HTML5 AppCache Helpers",
        "fork": false,
        "url": "https://api.github.com/repos/distri/appcache",
        "forks_url": "https://api.github.com/repos/distri/appcache/forks",
        "keys_url": "https://api.github.com/repos/distri/appcache/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/appcache/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/appcache/teams",
        "hooks_url": "https://api.github.com/repos/distri/appcache/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/appcache/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/appcache/events",
        "assignees_url": "https://api.github.com/repos/distri/appcache/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/appcache/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/appcache/tags",
        "blobs_url": "https://api.github.com/repos/distri/appcache/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/appcache/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/appcache/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/appcache/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/appcache/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/appcache/languages",
        "stargazers_url": "https://api.github.com/repos/distri/appcache/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/appcache/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/appcache/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/appcache/subscription",
        "commits_url": "https://api.github.com/repos/distri/appcache/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/appcache/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/appcache/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/appcache/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/appcache/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/appcache/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/appcache/merges",
        "archive_url": "https://api.github.com/repos/distri/appcache/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/appcache/downloads",
        "issues_url": "https://api.github.com/repos/distri/appcache/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/appcache/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/appcache/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/appcache/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/appcache/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/appcache/releases{/id}",
        "created_at": "2013-11-19T22:09:16Z",
        "updated_at": "2013-11-29T20:49:51Z",
        "pushed_at": "2013-11-19T22:10:28Z",
        "git_url": "git://github.com/distri/appcache.git",
        "ssh_url": "git@github.com:distri/appcache.git",
        "clone_url": "https://github.com/distri/appcache.git",
        "svn_url": "https://github.com/distri/appcache",
        "homepage": null,
        "size": 240,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "CoffeeScript",
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 1,
        "branch": "v0.2.0",
        "defaultBranch": "master"
      },
      "dependencies": {}
    },
    "runtime": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "runtime\n=======\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "version: \"0.2.0\"\nentryPoint: \"runtime\"\n",
          "type": "blob"
        },
        "runtime.coffee.md": {
          "path": "runtime.coffee.md",
          "mode": "100644",
          "content": "The runtime holds utilities to assist with an apps running environment.\n\nIt should me moved into it's own component one day.\n\n    Runtime = (pkg) ->\n\nHold on to a reference to our root node.\n\n      root = null\n\nReturns the node that is the parent of the script element that contains the code\nthat calls this function. If `document.write` has been called before this then the\nresults may not be accurate. Therefore be sure to call currentNode before\nwriting anything to the document.\n\n      currentNode = ->\n        target = document.documentElement\n\n        while (target.childNodes.length and target.lastChild.nodeType == 1)\n          target = target.lastChild\n\n        return target.parentNode\n\nDisplay a promo in the console linking back to the creator of this app.\n\n      promo = ->\n        console.log(\"%c You should meet my creator #{pkg.progenitor.url}\", \"\"\"\n          background: #000;\n          color: white;\n          font-size: 2em;\n          line-height: 2em;\n          padding: 10px 100px;\n          margin-bottom: 1em;\n          text-shadow:\n            0 0 0.05em #fff,\n            0 0 0.1em #fff,\n            0 0 0.15em #fff,\n            0 0 0.2em #ff00de,\n            0 0 0.35em #ff00de,\n            0 0 0.4em #ff00de,\n            0 0 0.5em #ff00de,\n            0 0 0.75em #ff00de;'\n        \"\"\")\n\nCall on start to boot up the runtime, get the root node, add styles, display a\npromo.\n\n      boot: ->\n        root = currentNode()\n\n        promo()\n\n        return root\n\nApply the stylesheet to the root node.\n\n      applyStyleSheet: (style) ->\n        styleNode = document.createElement(\"style\")\n        styleNode.innerHTML = style\n\n        root.appendChild(styleNode)\n\nExport\n\n    module.exports = Runtime\n",
          "type": "blob"
        },
        "test/runtime.coffee": {
          "path": "test/runtime.coffee",
          "mode": "100644",
          "content": "Runtime = require \"../runtime\"\n\ndescribe \"Runtime\", ->\n  it \"should be created from a package and provide a boot method\", ->\n    assert Runtime(PACKAGE).boot\n",
          "type": "blob"
        }
      },
      "distribution": {
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"runtime\"};",
          "type": "blob"
        },
        "runtime": {
          "path": "runtime",
          "content": "(function() {\n  var Runtime;\n\n  Runtime = function(pkg) {\n    var currentNode, promo, root;\n    root = null;\n    currentNode = function() {\n      var target;\n      target = document.documentElement;\n      while (target.childNodes.length && target.lastChild.nodeType === 1) {\n        target = target.lastChild;\n      }\n      return target.parentNode;\n    };\n    promo = function() {\n      return console.log(\"%c You should meet my creator \" + pkg.progenitor.url, \"background: #000;\\ncolor: white;\\nfont-size: 2em;\\nline-height: 2em;\\npadding: 10px 100px;\\nmargin-bottom: 1em;\\ntext-shadow:\\n  0 0 0.05em #fff,\\n  0 0 0.1em #fff,\\n  0 0 0.15em #fff,\\n  0 0 0.2em #ff00de,\\n  0 0 0.35em #ff00de,\\n  0 0 0.4em #ff00de,\\n  0 0 0.5em #ff00de,\\n  0 0 0.75em #ff00de;'\");\n    };\n    return {\n      boot: function() {\n        root = currentNode();\n        promo();\n        return root;\n      },\n      applyStyleSheet: function(style) {\n        var styleNode;\n        styleNode = document.createElement(\"style\");\n        styleNode.innerHTML = style;\n        return root.appendChild(styleNode);\n      }\n    };\n  };\n\n  module.exports = Runtime;\n\n}).call(this);\n\n//# sourceURL=runtime.coffee",
          "type": "blob"
        },
        "test/runtime": {
          "path": "test/runtime",
          "content": "(function() {\n  var Runtime;\n\n  Runtime = require(\"../runtime\");\n\n  describe(\"Runtime\", function() {\n    return it(\"should be created from a package and provide a boot method\", function() {\n      return assert(Runtime(PACKAGE).boot);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/runtime.coffee",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.2.0",
      "entryPoint": "runtime",
      "repository": {
        "id": 13202878,
        "name": "runtime",
        "full_name": "STRd6/runtime",
        "owner": {
          "login": "STRd6",
          "id": 18894,
          "avatar_url": "https://1.gravatar.com/avatar/33117162fff8a9cf50544a604f60c045?d=https%3A%2F%2Fidenticons.github.com%2F39df222bffe39629d904e4883eabc654.png&r=x",
          "gravatar_id": "33117162fff8a9cf50544a604f60c045",
          "url": "https://api.github.com/users/STRd6",
          "html_url": "https://github.com/STRd6",
          "followers_url": "https://api.github.com/users/STRd6/followers",
          "following_url": "https://api.github.com/users/STRd6/following{/other_user}",
          "gists_url": "https://api.github.com/users/STRd6/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/STRd6/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/STRd6/subscriptions",
          "organizations_url": "https://api.github.com/users/STRd6/orgs",
          "repos_url": "https://api.github.com/users/STRd6/repos",
          "events_url": "https://api.github.com/users/STRd6/events{/privacy}",
          "received_events_url": "https://api.github.com/users/STRd6/received_events",
          "type": "User",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/STRd6/runtime",
        "description": "",
        "fork": false,
        "url": "https://api.github.com/repos/STRd6/runtime",
        "forks_url": "https://api.github.com/repos/STRd6/runtime/forks",
        "keys_url": "https://api.github.com/repos/STRd6/runtime/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/STRd6/runtime/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/STRd6/runtime/teams",
        "hooks_url": "https://api.github.com/repos/STRd6/runtime/hooks",
        "issue_events_url": "https://api.github.com/repos/STRd6/runtime/issues/events{/number}",
        "events_url": "https://api.github.com/repos/STRd6/runtime/events",
        "assignees_url": "https://api.github.com/repos/STRd6/runtime/assignees{/user}",
        "branches_url": "https://api.github.com/repos/STRd6/runtime/branches{/branch}",
        "tags_url": "https://api.github.com/repos/STRd6/runtime/tags",
        "blobs_url": "https://api.github.com/repos/STRd6/runtime/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/STRd6/runtime/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/STRd6/runtime/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/STRd6/runtime/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/STRd6/runtime/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/STRd6/runtime/languages",
        "stargazers_url": "https://api.github.com/repos/STRd6/runtime/stargazers",
        "contributors_url": "https://api.github.com/repos/STRd6/runtime/contributors",
        "subscribers_url": "https://api.github.com/repos/STRd6/runtime/subscribers",
        "subscription_url": "https://api.github.com/repos/STRd6/runtime/subscription",
        "commits_url": "https://api.github.com/repos/STRd6/runtime/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/STRd6/runtime/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/STRd6/runtime/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/STRd6/runtime/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/STRd6/runtime/contents/{+path}",
        "compare_url": "https://api.github.com/repos/STRd6/runtime/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/STRd6/runtime/merges",
        "archive_url": "https://api.github.com/repos/STRd6/runtime/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/STRd6/runtime/downloads",
        "issues_url": "https://api.github.com/repos/STRd6/runtime/issues{/number}",
        "pulls_url": "https://api.github.com/repos/STRd6/runtime/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/STRd6/runtime/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/STRd6/runtime/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/STRd6/runtime/labels{/name}",
        "releases_url": "https://api.github.com/repos/STRd6/runtime/releases{/id}",
        "created_at": "2013-09-30T00:44:37Z",
        "updated_at": "2013-09-30T01:02:40Z",
        "pushed_at": "2013-09-30T01:02:39Z",
        "git_url": "git://github.com/STRd6/runtime.git",
        "ssh_url": "git@github.com:STRd6/runtime.git",
        "clone_url": "https://github.com/STRd6/runtime.git",
        "svn_url": "https://github.com/STRd6/runtime",
        "homepage": null,
        "size": 180,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "CoffeeScript",
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "network_count": 0,
        "subscribers_count": 1,
        "branch": "v0.2.0",
        "defaultBranch": "master"
      },
      "dependencies": {},
      "name": "runtime"
    },
    "touch-canvas": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "touch-canvas\n============\n\nA canvas you can touch\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "entryPoint: \"touch_canvas\"\nversion: \"0.3.0\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n  \"http://strd6.github.io/tempest/javascripts/envweb.js\"\n]\ndependencies:\n  \"pixie-canvas\": \"distri/pixie-canvas:v0.9.1\"\n",
          "type": "blob"
        },
        "touch_canvas.coffee.md": {
          "path": "touch_canvas.coffee.md",
          "mode": "100644",
          "content": "Touch Canvas\n============\n\nA canvas element that reports mouse and touch events in the range [0, 1].\n\n    PixieCanvas = require \"pixie-canvas\"\n\nA number really close to 1. We should never actually return 1, but move events\nmay get a little fast and loose with exiting the canvas, so let's play it safe.\n\n    MAX = 0.999999999999\n\n    TouchCanvas = (I={}) ->\n      self = PixieCanvas I\n\n      Core(I, self)\n\n      self.include Bindable\n\n      element = self.element()\n\n      # Keep track of if the mouse is active in the element\n      active = false\n\nWhen we click within the canvas set the value for the position we clicked at.\n\n      $(element).on \"mousedown\", (e) ->\n        active = true\n\n        self.trigger \"touch\", localPosition(e)\n\nHandle touch starts\n\n      $(element).on \"touchstart\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"touch\", localPosition(touch)\n\nWhen the mouse moves apply a change for each x value in the intervening positions.\n\n      $(element).on \"mousemove\", (e) ->\n        if active\n          self.trigger \"move\", localPosition(e)\n\nHandle moves outside of the element.\n\n      $(document).on \"mousemove\", (e) ->\n        if active\n          self.trigger \"move\", localPosition(e)\n\nHandle touch moves.\n\n      $(element).on \"touchmove\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"move\", localPosition(touch)\n\nHandle releases.\n\n      $(element).on \"mouseup\", (e) ->\n        self.trigger \"release\", localPosition(e)\n        active = false\n\n        return\n\nHandle touch ends.\n\n      $(element).on \"touchend\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"release\", localPosition(touch)\n\nWhenever the mouse button is released from anywhere, deactivate. Be sure to\ntrigger the release event if the mousedown started within the element.\n\n      $(document).on \"mouseup\", (e) ->\n        if active\n          self.trigger \"release\", localPosition(e)\n\n        active = false\n\n        return\n\nHelpers\n-------\n\nProcess touches\n\n      processTouches = (event, fn) ->\n        event.preventDefault()\n\n        if event.type is \"touchend\"\n          # touchend doesn't have any touches, but does have changed touches\n          touches = event.changedTouches\n        else\n          touches = event.touches\n\n        self.debug? Array::map.call touches, ({identifier, pageX, pageY}) ->\n          \"[#{identifier}: #{pageX}, #{pageY} (#{event.type})]\\n\"\n\n        Array::forEach.call touches, fn\n\nLocal event position.\n\n      localPosition = (e) ->\n        $currentTarget = $(element)\n        offset = $currentTarget.offset()\n\n        width = $currentTarget.width()\n        height = $currentTarget.height()\n\n        point = Point(\n          ((e.pageX - offset.left) / width).clamp(0, MAX)\n          ((e.pageY - offset.top) / height).clamp(0, MAX)\n        )\n\n        # Add mouse into touch identifiers as 0\n        point.identifier = (e.identifier + 1) or 0\n\n        return point\n\nReturn self\n\n      return self\n\nExport\n\n    module.exports = TouchCanvas\n",
          "type": "blob"
        }
      },
      "distribution": {
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"entryPoint\":\"touch_canvas\",\"version\":\"0.3.0\",\"remoteDependencies\":[\"//code.jquery.com/jquery-1.10.1.min.js\",\"http://strd6.github.io/tempest/javascripts/envweb.js\"],\"dependencies\":{\"pixie-canvas\":\"distri/pixie-canvas:v0.9.1\"}};",
          "type": "blob"
        },
        "touch_canvas": {
          "path": "touch_canvas",
          "content": "(function() {\n  var MAX, PixieCanvas, TouchCanvas;\n\n  PixieCanvas = require(\"pixie-canvas\");\n\n  MAX = 0.999999999999;\n\n  TouchCanvas = function(I) {\n    var active, element, localPosition, processTouches, self;\n    if (I == null) {\n      I = {};\n    }\n    self = PixieCanvas(I);\n    Core(I, self);\n    self.include(Bindable);\n    element = self.element();\n    active = false;\n    $(element).on(\"mousedown\", function(e) {\n      active = true;\n      return self.trigger(\"touch\", localPosition(e));\n    });\n    $(element).on(\"touchstart\", function(e) {\n      return processTouches(event, function(touch) {\n        return self.trigger(\"touch\", localPosition(touch));\n      });\n    });\n    $(element).on(\"mousemove\", function(e) {\n      if (active) {\n        return self.trigger(\"move\", localPosition(e));\n      }\n    });\n    $(document).on(\"mousemove\", function(e) {\n      if (active) {\n        return self.trigger(\"move\", localPosition(e));\n      }\n    });\n    $(element).on(\"touchmove\", function(e) {\n      return processTouches(event, function(touch) {\n        return self.trigger(\"move\", localPosition(touch));\n      });\n    });\n    $(element).on(\"mouseup\", function(e) {\n      self.trigger(\"release\", localPosition(e));\n      active = false;\n    });\n    $(element).on(\"touchend\", function(e) {\n      return processTouches(event, function(touch) {\n        return self.trigger(\"release\", localPosition(touch));\n      });\n    });\n    $(document).on(\"mouseup\", function(e) {\n      if (active) {\n        self.trigger(\"release\", localPosition(e));\n      }\n      active = false;\n    });\n    processTouches = function(event, fn) {\n      var touches;\n      event.preventDefault();\n      if (event.type === \"touchend\") {\n        touches = event.changedTouches;\n      } else {\n        touches = event.touches;\n      }\n      if (typeof self.debug === \"function\") {\n        self.debug(Array.prototype.map.call(touches, function(_arg) {\n          var identifier, pageX, pageY;\n          identifier = _arg.identifier, pageX = _arg.pageX, pageY = _arg.pageY;\n          return \"[\" + identifier + \": \" + pageX + \", \" + pageY + \" (\" + event.type + \")]\\n\";\n        }));\n      }\n      return Array.prototype.forEach.call(touches, fn);\n    };\n    localPosition = function(e) {\n      var $currentTarget, height, offset, point, width;\n      $currentTarget = $(element);\n      offset = $currentTarget.offset();\n      width = $currentTarget.width();\n      height = $currentTarget.height();\n      point = Point(((e.pageX - offset.left) / width).clamp(0, MAX), ((e.pageY - offset.top) / height).clamp(0, MAX));\n      point.identifier = (e.identifier + 1) || 0;\n      return point;\n    };\n    return self;\n  };\n\n  module.exports = TouchCanvas;\n\n}).call(this);\n\n//# sourceURL=touch_canvas.coffee",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.3.0",
      "entryPoint": "touch_canvas",
      "remoteDependencies": [
        "//code.jquery.com/jquery-1.10.1.min.js",
        "http://strd6.github.io/tempest/javascripts/envweb.js"
      ],
      "repository": {
        "id": 13783983,
        "name": "touch-canvas",
        "full_name": "distri/touch-canvas",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/touch-canvas",
        "description": "A canvas you can touch",
        "fork": false,
        "url": "https://api.github.com/repos/distri/touch-canvas",
        "forks_url": "https://api.github.com/repos/distri/touch-canvas/forks",
        "keys_url": "https://api.github.com/repos/distri/touch-canvas/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/touch-canvas/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/touch-canvas/teams",
        "hooks_url": "https://api.github.com/repos/distri/touch-canvas/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/touch-canvas/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/touch-canvas/events",
        "assignees_url": "https://api.github.com/repos/distri/touch-canvas/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/touch-canvas/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/touch-canvas/tags",
        "blobs_url": "https://api.github.com/repos/distri/touch-canvas/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/touch-canvas/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/touch-canvas/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/touch-canvas/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/touch-canvas/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/touch-canvas/languages",
        "stargazers_url": "https://api.github.com/repos/distri/touch-canvas/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/touch-canvas/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/touch-canvas/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/touch-canvas/subscription",
        "commits_url": "https://api.github.com/repos/distri/touch-canvas/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/touch-canvas/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/touch-canvas/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/touch-canvas/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/touch-canvas/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/touch-canvas/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/touch-canvas/merges",
        "archive_url": "https://api.github.com/repos/distri/touch-canvas/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/touch-canvas/downloads",
        "issues_url": "https://api.github.com/repos/distri/touch-canvas/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/touch-canvas/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/touch-canvas/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/touch-canvas/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/touch-canvas/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/touch-canvas/releases{/id}",
        "created_at": "2013-10-22T19:46:48Z",
        "updated_at": "2013-11-29T20:39:31Z",
        "pushed_at": "2013-11-29T20:38:52Z",
        "git_url": "git://github.com/distri/touch-canvas.git",
        "ssh_url": "git@github.com:distri/touch-canvas.git",
        "clone_url": "https://github.com/distri/touch-canvas.git",
        "svn_url": "https://github.com/distri/touch-canvas",
        "homepage": null,
        "size": 2900,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "CoffeeScript",
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 1,
        "branch": "v0.3.0",
        "defaultBranch": "master"
      },
      "dependencies": {
        "pixie-canvas": {
          "source": {
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "entryPoint: \"pixie_canvas\"\nversion: \"0.9.1\"\n",
              "type": "blob"
            },
            "pixie_canvas.coffee.md": {
              "path": "pixie_canvas.coffee.md",
              "mode": "100644",
              "content": "Pixie Canvas\n============\n\nPixieCanvas provides a convenient wrapper for working with Context2d.\n\nMethods try to be as flexible as possible as to what arguments they take.\n\nNon-getter methods return `this` for method chaining.\n\n    TAU = 2 * Math.PI\n\n    module.exports = (options={}) ->\n        defaults options,\n          width: 400\n          height: 400\n          init: ->\n\n        canvas = document.createElement \"canvas\"\n        canvas.width = options.width\n        canvas.height = options.height\n\n        context = undefined\n\n        self =\n\n`clear` clears the entire canvas (or a portion of it).\n\nTo clear the entire canvas use `canvas.clear()`\n\n>     #! paint\n>     # Set up: Fill canvas with blue\n>     canvas.fill(\"blue\")\n>\n>     # Clear a portion of the canvas\n>     canvas.clear\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n\n          clear: ({x, y, width, height}={}) ->\n            x ?= 0\n            y ?= 0\n            width = canvas.width unless width?\n            height = canvas.height unless height?\n\n            context.clearRect(x, y, width, height)\n\n            return this\n\nFills the entire canvas (or a specified section of it) with\nthe given color.\n\n>     #! paint\n>     # Paint the town (entire canvas) red\n>     canvas.fill \"red\"\n>\n>     # Fill a section of the canvas white (#FFF)\n>     canvas.fill\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n>       color: \"#FFF\"\n\n          fill: (color={}) ->\n            unless (typeof color is \"string\") or color.channels\n              {x, y, width, height, bounds, color} = color\n\n            {x, y, width, height} = bounds if bounds\n\n            x ||= 0\n            y ||= 0\n            width = canvas.width unless width?\n            height = canvas.height unless height?\n\n            @fillColor(color)\n            context.fillRect(x, y, width, height)\n\n            return this\n\nA direct map to the Context2d draw image. `GameObject`s\nthat implement drawable will have this wrapped up nicely,\nso there is a good chance that you will not have to deal with\nit directly.\n\n>     #! paint\n>     $ \"<img>\",\n>       src: \"https://secure.gravatar.com/avatar/33117162fff8a9cf50544a604f60c045\"\n>       load: ->\n>         canvas.drawImage(this, 25, 25)\n\n          drawImage: (args...) ->\n            context.drawImage(args...)\n\n            return this\n\nDraws a circle at the specified position with the specified\nradius and color.\n\n>     #! paint\n>     # Draw a large orange circle\n>     canvas.drawCircle\n>       radius: 30\n>       position: Point(100, 75)\n>       color: \"orange\"\n>\n>     # You may also set a stroke\n>     canvas.drawCircle\n>       x: 25\n>       y: 50\n>       radius: 10\n>       color: \"blue\"\n>       stroke:\n>         color: \"red\"\n>         width: 1\n\nYou can pass in circle objects as well.\n\n>     #! paint\n>     # Create a circle object to set up the next examples\n>     circle =\n>       radius: 20\n>       x: 50\n>       y: 50\n>\n>     # Draw a given circle in yellow\n>     canvas.drawCircle\n>       circle: circle\n>       color: \"yellow\"\n>\n>     # Draw the circle in green at a different position\n>     canvas.drawCircle\n>       circle: circle\n>       position: Point(25, 75)\n>       color: \"green\"\n\nYou may set a stroke, or even pass in only a stroke to draw an unfilled circle.\n\n>     #! paint\n>     # Draw an outline circle in purple.\n>     canvas.drawCircle\n>       x: 50\n>       y: 75\n>       radius: 10\n>       stroke:\n>         color: \"purple\"\n>         width: 2\n>\n\n          drawCircle: ({x, y, radius, position, color, stroke, circle}) ->\n            {x, y, radius} = circle if circle\n            {x, y} = position if position\n\n            radius = 0 if radius < 0\n\n            context.beginPath()\n            context.arc(x, y, radius, 0, TAU, true)\n            context.closePath()\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.stroke()\n\n            return this\n\nDraws a rectangle at the specified position with given\nwidth and height. Optionally takes a position, bounds\nand color argument.\n\n\n          drawRect: ({x, y, width, height, position, bounds, color, stroke}) ->\n            {x, y, width, height} = bounds if bounds\n            {x, y} = position if position\n\n            if color\n              @fillColor(color)\n              context.fillRect(x, y, width, height)\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.strokeRect(x, y, width, height)\n\n            return @\n\n>     #! paint\n>     # Draw a red rectangle using x, y, width and height\n>     canvas.drawRect\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n>       color: \"#F00\"\n\n----\n\nYou can mix and match position, witdth and height.\n\n>     #! paint\n>     canvas.drawRect\n>       position: Point(0, 0)\n>       width: 50\n>       height: 50\n>       color: \"blue\"\n>       stroke:\n>         color: \"orange\"\n>         width: 3\n\n----\n\nA bounds can be reused to draw multiple rectangles.\n\n>     #! paint\n>     bounds =\n>       x: 100\n>       y: 0\n>       width: 100\n>       height: 100\n>\n>     # Draw a purple rectangle using bounds\n>     canvas.drawRect\n>       bounds: bounds\n>       color: \"green\"\n>\n>     # Draw the outline of the same bounds, but at a different position\n>     canvas.drawRect\n>       bounds: bounds\n>       position: Point(0, 50)\n>       stroke:\n>         color: \"purple\"\n>         width: 2\n\n----\n\nDraw a line from `start` to `end`.\n\n>     #! paint\n>     # Draw a sweet diagonal\n>     canvas.drawLine\n>       start: Point(0, 0)\n>       end: Point(200, 200)\n>       color: \"purple\"\n>\n>     # Draw another sweet diagonal\n>     canvas.drawLine\n>       start: Point(200, 0)\n>       end: Point(0, 200)\n>       color: \"red\"\n>       width: 6\n>\n>     # Now draw a sweet horizontal with a direction and a length\n>     canvas.drawLine\n>       start: Point(0, 100)\n>       length: 200\n>       direction: Point(1, 0)\n>       color: \"orange\"\n\n          drawLine: ({start, end, width, color, direction, length}) ->\n            width ||= 3\n\n            if direction\n              end = direction.norm(length).add(start)\n\n            @lineWidth(width)\n            @strokeColor(color)\n\n            context.beginPath()\n            context.moveTo(start.x, start.y)\n            context.lineTo(end.x, end.y)\n            context.closePath()\n            context.stroke()\n\n            return this\n\nDraw a polygon.\n\n>     #! paint\n>     # Draw a sweet rhombus\n>     canvas.drawPoly\n>       points: [\n>         Point(50, 25)\n>         Point(75, 50)\n>         Point(50, 75)\n>         Point(25, 50)\n>       ]\n>       color: \"purple\"\n>       stroke:\n>         color: \"red\"\n>         width: 2\n\n          drawPoly: ({points, color, stroke}) ->\n            context.beginPath()\n            points.forEach (point, i) ->\n              if i == 0\n                context.moveTo(point.x, point.y)\n              else\n                context.lineTo(point.x, point.y)\n            context.lineTo points[0].x, points[0].y\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.stroke()\n\n            return @\n\nDraw a rounded rectangle.\n\nAdapted from http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html\n\n>     #! paint\n>     # Draw a purple rounded rectangle with a red outline\n>     canvas.drawRoundRect\n>       position: Point(25, 25)\n>       radius: 10\n>       width: 150\n>       height: 100\n>       color: \"purple\"\n>       stroke:\n>         color: \"red\"\n>         width: 2\n\n          drawRoundRect: ({x, y, width, height, radius, position, bounds, color, stroke}) ->\n            radius = 5 unless radius?\n\n            {x, y, width, height} = bounds if bounds\n            {x, y} = position if position\n\n            context.beginPath()\n            context.moveTo(x + radius, y)\n            context.lineTo(x + width - radius, y)\n            context.quadraticCurveTo(x + width, y, x + width, y + radius)\n            context.lineTo(x + width, y + height - radius)\n            context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)\n            context.lineTo(x + radius, y + height)\n            context.quadraticCurveTo(x, y + height, x, y + height - radius)\n            context.lineTo(x, y + radius)\n            context.quadraticCurveTo(x, y, x + radius, y)\n            context.closePath()\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @lineWidth(stroke.width)\n              @strokeColor(stroke.color)\n              context.stroke()\n\n            return this\n\nDraws text on the canvas at the given position, in the given color.\nIf no color is given then the previous fill color is used.\n\n>     #! paint\n>     # Fill canvas to indicate bounds\n>     canvas.fill\n>       color: '#eee'\n>\n>     # A line to indicate the baseline\n>     canvas.drawLine\n>       start: Point(25, 50)\n>       end: Point(125, 50)\n>       color: \"#333\"\n>       width: 1\n>\n>     # Draw some text, note the position of the baseline\n>     canvas.drawText\n>       position: Point(25, 50)\n>       color: \"red\"\n>       text: \"It's dangerous to go alone\"\n\n\n          drawText: ({x, y, text, position, color, font}) ->\n            {x, y} = position if position\n\n            @fillColor(color)\n            @font(font) if font\n            context.fillText(text, x, y)\n\n            return this\n\nCenters the given text on the canvas at the given y position. An x position\nor point position can also be given in which case the text is centered at the\nx, y or position value specified.\n\n>     #! paint\n>     # Fill canvas to indicate bounds\n>     canvas.fill\n>       color: \"#eee\"\n>\n>     # Center text on the screen at y value 25\n>     canvas.centerText\n>       y: 25\n>       color: \"red\"\n>       text: \"It's dangerous to go alone\"\n>\n>     # Center text at point (75, 75)\n>     canvas.centerText\n>       position: Point(75, 75)\n>       color: \"green\"\n>       text: \"take this\"\n\n          centerText: ({text, x, y, position, color, font}) ->\n            {x, y} = position if position\n\n            x = canvas.width / 2 unless x?\n\n            textWidth = @measureText(text)\n\n            @drawText {\n              text\n              color\n              font\n              x: x - (textWidth) / 2\n              y\n            }\n\nSetting the fill color:\n\n`canvas.fillColor(\"#FF0000\")`\n\nPassing no arguments returns the fillColor:\n\n`canvas.fillColor() # => \"#FF000000\"`\n\nYou can also pass a Color object:\n\n`canvas.fillColor(Color('sky blue'))`\n\n          fillColor: (color) ->\n            if color\n              if color.channels\n                context.fillStyle = color.toString()\n              else\n                context.fillStyle = color\n\n              return @\n            else\n              return context.fillStyle\n\nSetting the stroke color:\n\n`canvas.strokeColor(\"#FF0000\")`\n\nPassing no arguments returns the strokeColor:\n\n`canvas.strokeColor() # => \"#FF0000\"`\n\nYou can also pass a Color object:\n\n`canvas.strokeColor(Color('sky blue'))`\n\n          strokeColor: (color) ->\n            if color\n              if color.channels\n                context.strokeStyle = color.toString()\n              else\n                context.strokeStyle = color\n\n              return this\n            else\n              return context.strokeStyle\n\nDetermine how wide some text is.\n\n`canvas.measureText('Hello World!') # => 55`\n\nIt may have accuracy issues depending on the font used.\n\n          measureText: (text) ->\n            context.measureText(text).width\n\nPasses this canvas to the block with the given matrix transformation\napplied. All drawing methods called within the block will draw\ninto the canvas with the transformation applied. The transformation\nis removed at the end of the block, even if the block throws an error.\n\n          withTransform: (matrix, block) ->\n            context.save()\n\n            context.transform(\n              matrix.a,\n              matrix.b,\n              matrix.c,\n              matrix.d,\n              matrix.tx,\n              matrix.ty\n            )\n\n            try\n              block(this)\n            finally\n              context.restore()\n\n            return this\n\nStraight proxy to context `putImageData` method.\n\n          putImageData: (args...) ->\n            context.putImageData(args...)\n\n            return this\n\nContext getter.\n\n          context: ->\n            context\n\nGetter for the actual html canvas element.\n\n          element: ->\n            canvas\n\nStraight proxy to context pattern creation.\n\n          createPattern: (image, repitition) ->\n            context.createPattern(image, repitition)\n\nSet a clip rectangle.\n\n          clip: (x, y, width, height) ->\n            context.beginPath()\n            context.rect(x, y, width, height)\n            context.clip()\n\n            return this\n\nGenerate accessors that get properties from the context object.\n\n        contextAttrAccessor = (attrs...) ->\n          attrs.forEach (attr) ->\n            self[attr] = (newVal) ->\n              if newVal?\n                context[attr] = newVal\n                return @\n              else\n                context[attr]\n\n        contextAttrAccessor(\n          \"font\",\n          \"globalAlpha\",\n          \"globalCompositeOperation\",\n          \"lineWidth\",\n          \"textAlign\",\n        )\n\nGenerate accessors that get properties from the canvas object.\n\n        canvasAttrAccessor = (attrs...) ->\n          attrs.forEach (attr) ->\n            self[attr] = (newVal) ->\n              if newVal?\n                canvas[attr] = newVal\n                return @\n              else\n                canvas[attr]\n\n        canvasAttrAccessor(\n          \"height\",\n          \"width\",\n        )\n\n        context = canvas.getContext('2d')\n\n        options.init(self)\n\n        return self\n\nDepend on either jQuery or Zepto for now (TODO: Don't depend on either)\n\nHelpers\n-------\n\nFill in default properties for an object, setting them only if they are not\nalready present.\n\n    defaults = (target, objects...) ->\n      for object in objects\n        for name of object\n          unless target.hasOwnProperty(name)\n            target[name] = object[name]\n\n      return target\n\nInteractive Examples\n--------------------\n\n>     #! setup\n>     Canvas = require \"/pixie_canvas\"\n>\n>     window.Point ?= (x, y) ->\n>       x: x\n>       y: y\n>\n>     Interactive.register \"paint\", ({source, runtimeElement}) ->\n>       canvas = Canvas\n>         width: 400\n>         height: 200\n>\n>       code = CoffeeScript.compile(source)\n>\n>       runtimeElement.empty().append canvas.element()\n>       Function(\"canvas\", code)(canvas)\n",
              "type": "blob"
            },
            "test/test.coffee": {
              "path": "test/test.coffee",
              "mode": "100644",
              "content": "Canvas = require \"../pixie_canvas\"\n\ndescribe \"pixie canvas\", ->\n  it \"Should create a canvas\", ->\n    canvas = Canvas\n      width: 400\n      height: 150\n\n    assert canvas\n    \n    assert canvas.width() is 400\n",
              "type": "blob"
            }
          },
          "distribution": {
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"entryPoint\":\"pixie_canvas\",\"version\":\"0.9.1\"};",
              "type": "blob"
            },
            "pixie_canvas": {
              "path": "pixie_canvas",
              "content": "(function() {\n  var TAU, defaults,\n    __slice = [].slice;\n\n  TAU = 2 * Math.PI;\n\n  module.exports = function(options) {\n    var canvas, canvasAttrAccessor, context, contextAttrAccessor, self;\n    if (options == null) {\n      options = {};\n    }\n    defaults(options, {\n      width: 400,\n      height: 400,\n      init: function() {}\n    });\n    canvas = document.createElement(\"canvas\");\n    canvas.width = options.width;\n    canvas.height = options.height;\n    context = void 0;\n    self = {\n      clear: function(_arg) {\n        var height, width, x, y, _ref;\n        _ref = _arg != null ? _arg : {}, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height;\n        if (x == null) {\n          x = 0;\n        }\n        if (y == null) {\n          y = 0;\n        }\n        if (width == null) {\n          width = canvas.width;\n        }\n        if (height == null) {\n          height = canvas.height;\n        }\n        context.clearRect(x, y, width, height);\n        return this;\n      },\n      fill: function(color) {\n        var bounds, height, width, x, y, _ref;\n        if (color == null) {\n          color = {};\n        }\n        if (!((typeof color === \"string\") || color.channels)) {\n          _ref = color, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height, bounds = _ref.bounds, color = _ref.color;\n        }\n        if (bounds) {\n          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;\n        }\n        x || (x = 0);\n        y || (y = 0);\n        if (width == null) {\n          width = canvas.width;\n        }\n        if (height == null) {\n          height = canvas.height;\n        }\n        this.fillColor(color);\n        context.fillRect(x, y, width, height);\n        return this;\n      },\n      drawImage: function() {\n        var args;\n        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        context.drawImage.apply(context, args);\n        return this;\n      },\n      drawCircle: function(_arg) {\n        var circle, color, position, radius, stroke, x, y;\n        x = _arg.x, y = _arg.y, radius = _arg.radius, position = _arg.position, color = _arg.color, stroke = _arg.stroke, circle = _arg.circle;\n        if (circle) {\n          x = circle.x, y = circle.y, radius = circle.radius;\n        }\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        if (radius < 0) {\n          radius = 0;\n        }\n        context.beginPath();\n        context.arc(x, y, radius, 0, TAU, true);\n        context.closePath();\n        if (color) {\n          this.fillColor(color);\n          context.fill();\n        }\n        if (stroke) {\n          this.strokeColor(stroke.color);\n          this.lineWidth(stroke.width);\n          context.stroke();\n        }\n        return this;\n      },\n      drawRect: function(_arg) {\n        var bounds, color, height, position, stroke, width, x, y;\n        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;\n        if (bounds) {\n          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;\n        }\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        if (color) {\n          this.fillColor(color);\n          context.fillRect(x, y, width, height);\n        }\n        if (stroke) {\n          this.strokeColor(stroke.color);\n          this.lineWidth(stroke.width);\n          context.strokeRect(x, y, width, height);\n        }\n        return this;\n      },\n      drawLine: function(_arg) {\n        var color, direction, end, length, start, width;\n        start = _arg.start, end = _arg.end, width = _arg.width, color = _arg.color, direction = _arg.direction, length = _arg.length;\n        width || (width = 3);\n        if (direction) {\n          end = direction.norm(length).add(start);\n        }\n        this.lineWidth(width);\n        this.strokeColor(color);\n        context.beginPath();\n        context.moveTo(start.x, start.y);\n        context.lineTo(end.x, end.y);\n        context.closePath();\n        context.stroke();\n        return this;\n      },\n      drawPoly: function(_arg) {\n        var color, points, stroke;\n        points = _arg.points, color = _arg.color, stroke = _arg.stroke;\n        context.beginPath();\n        points.forEach(function(point, i) {\n          if (i === 0) {\n            return context.moveTo(point.x, point.y);\n          } else {\n            return context.lineTo(point.x, point.y);\n          }\n        });\n        context.lineTo(points[0].x, points[0].y);\n        if (color) {\n          this.fillColor(color);\n          context.fill();\n        }\n        if (stroke) {\n          this.strokeColor(stroke.color);\n          this.lineWidth(stroke.width);\n          context.stroke();\n        }\n        return this;\n      },\n      drawRoundRect: function(_arg) {\n        var bounds, color, height, position, radius, stroke, width, x, y;\n        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, radius = _arg.radius, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;\n        if (radius == null) {\n          radius = 5;\n        }\n        if (bounds) {\n          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;\n        }\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        context.beginPath();\n        context.moveTo(x + radius, y);\n        context.lineTo(x + width - radius, y);\n        context.quadraticCurveTo(x + width, y, x + width, y + radius);\n        context.lineTo(x + width, y + height - radius);\n        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);\n        context.lineTo(x + radius, y + height);\n        context.quadraticCurveTo(x, y + height, x, y + height - radius);\n        context.lineTo(x, y + radius);\n        context.quadraticCurveTo(x, y, x + radius, y);\n        context.closePath();\n        if (color) {\n          this.fillColor(color);\n          context.fill();\n        }\n        if (stroke) {\n          this.lineWidth(stroke.width);\n          this.strokeColor(stroke.color);\n          context.stroke();\n        }\n        return this;\n      },\n      drawText: function(_arg) {\n        var color, font, position, text, x, y;\n        x = _arg.x, y = _arg.y, text = _arg.text, position = _arg.position, color = _arg.color, font = _arg.font;\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        this.fillColor(color);\n        if (font) {\n          this.font(font);\n        }\n        context.fillText(text, x, y);\n        return this;\n      },\n      centerText: function(_arg) {\n        var color, font, position, text, textWidth, x, y;\n        text = _arg.text, x = _arg.x, y = _arg.y, position = _arg.position, color = _arg.color, font = _arg.font;\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        if (x == null) {\n          x = canvas.width / 2;\n        }\n        textWidth = this.measureText(text);\n        return this.drawText({\n          text: text,\n          color: color,\n          font: font,\n          x: x - textWidth / 2,\n          y: y\n        });\n      },\n      fillColor: function(color) {\n        if (color) {\n          if (color.channels) {\n            context.fillStyle = color.toString();\n          } else {\n            context.fillStyle = color;\n          }\n          return this;\n        } else {\n          return context.fillStyle;\n        }\n      },\n      strokeColor: function(color) {\n        if (color) {\n          if (color.channels) {\n            context.strokeStyle = color.toString();\n          } else {\n            context.strokeStyle = color;\n          }\n          return this;\n        } else {\n          return context.strokeStyle;\n        }\n      },\n      measureText: function(text) {\n        return context.measureText(text).width;\n      },\n      withTransform: function(matrix, block) {\n        context.save();\n        context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);\n        try {\n          block(this);\n        } finally {\n          context.restore();\n        }\n        return this;\n      },\n      putImageData: function() {\n        var args;\n        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        context.putImageData.apply(context, args);\n        return this;\n      },\n      context: function() {\n        return context;\n      },\n      element: function() {\n        return canvas;\n      },\n      createPattern: function(image, repitition) {\n        return context.createPattern(image, repitition);\n      },\n      clip: function(x, y, width, height) {\n        context.beginPath();\n        context.rect(x, y, width, height);\n        context.clip();\n        return this;\n      }\n    };\n    contextAttrAccessor = function() {\n      var attrs;\n      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return attrs.forEach(function(attr) {\n        return self[attr] = function(newVal) {\n          if (newVal != null) {\n            context[attr] = newVal;\n            return this;\n          } else {\n            return context[attr];\n          }\n        };\n      });\n    };\n    contextAttrAccessor(\"font\", \"globalAlpha\", \"globalCompositeOperation\", \"lineWidth\", \"textAlign\");\n    canvasAttrAccessor = function() {\n      var attrs;\n      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return attrs.forEach(function(attr) {\n        return self[attr] = function(newVal) {\n          if (newVal != null) {\n            canvas[attr] = newVal;\n            return this;\n          } else {\n            return canvas[attr];\n          }\n        };\n      });\n    };\n    canvasAttrAccessor(\"height\", \"width\");\n    context = canvas.getContext('2d');\n    options.init(self);\n    return self;\n  };\n\n  defaults = function() {\n    var name, object, objects, target, _i, _len;\n    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = objects.length; _i < _len; _i++) {\n      object = objects[_i];\n      for (name in object) {\n        if (!target.hasOwnProperty(name)) {\n          target[name] = object[name];\n        }\n      }\n    }\n    return target;\n  };\n\n}).call(this);\n\n//# sourceURL=pixie_canvas.coffee",
              "type": "blob"
            },
            "test/test": {
              "path": "test/test",
              "content": "(function() {\n  var Canvas;\n\n  Canvas = require(\"../pixie_canvas\");\n\n  describe(\"pixie canvas\", function() {\n    return it(\"Should create a canvas\", function() {\n      var canvas;\n      canvas = Canvas({\n        width: 400,\n        height: 150\n      });\n      assert(canvas);\n      return assert(canvas.width() === 400);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/test.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.9.1",
          "entryPoint": "pixie_canvas",
          "repository": {
            "id": 12096899,
            "name": "pixie-canvas",
            "full_name": "distri/pixie-canvas",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/pixie-canvas",
            "description": "A pretty ok HTML5 canvas wrapper",
            "fork": false,
            "url": "https://api.github.com/repos/distri/pixie-canvas",
            "forks_url": "https://api.github.com/repos/distri/pixie-canvas/forks",
            "keys_url": "https://api.github.com/repos/distri/pixie-canvas/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/pixie-canvas/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/pixie-canvas/teams",
            "hooks_url": "https://api.github.com/repos/distri/pixie-canvas/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/pixie-canvas/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/pixie-canvas/events",
            "assignees_url": "https://api.github.com/repos/distri/pixie-canvas/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/pixie-canvas/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/pixie-canvas/tags",
            "blobs_url": "https://api.github.com/repos/distri/pixie-canvas/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/pixie-canvas/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/pixie-canvas/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/pixie-canvas/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/pixie-canvas/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/pixie-canvas/languages",
            "stargazers_url": "https://api.github.com/repos/distri/pixie-canvas/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/pixie-canvas/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/pixie-canvas/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/pixie-canvas/subscription",
            "commits_url": "https://api.github.com/repos/distri/pixie-canvas/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/pixie-canvas/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/pixie-canvas/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/pixie-canvas/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/pixie-canvas/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/pixie-canvas/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/pixie-canvas/merges",
            "archive_url": "https://api.github.com/repos/distri/pixie-canvas/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/pixie-canvas/downloads",
            "issues_url": "https://api.github.com/repos/distri/pixie-canvas/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/pixie-canvas/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/pixie-canvas/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/pixie-canvas/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/pixie-canvas/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/pixie-canvas/releases{/id}",
            "created_at": "2013-08-14T01:15:34Z",
            "updated_at": "2013-11-29T20:35:57Z",
            "pushed_at": "2013-11-29T20:34:09Z",
            "git_url": "git://github.com/distri/pixie-canvas.git",
            "ssh_url": "git@github.com:distri/pixie-canvas.git",
            "clone_url": "https://github.com/distri/pixie-canvas.git",
            "svn_url": "https://github.com/distri/pixie-canvas",
            "homepage": null,
            "size": 2464,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 1,
            "forks": 0,
            "open_issues": 1,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.9.1",
            "defaultBranch": "master"
          },
          "dependencies": {}
        }
      }
    }
  }
});