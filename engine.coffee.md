Engine
======

    Compositions = require "./lib/compositions"
    Hotkeys = require "./hotkeys"

    Ball = require "./ball"
    Chapters = require "./levels"
    Pin = require "./pin"
    Physics = require "./physics"
    {Size} = require "./lib/util"

    # ⚀
    module.exports = (I={}, self=Core(I)) ->
      Object.defaults I,
        age: 0
        chapter: 0
        levelName: "⚀"
        pins: [
          {}
        ]
        startZone: 100

      self.include Compositions
      self.include Hotkeys
      self.include Physics

      self.attrAccessor "age", "levelName"

      self.attrModel "ball", Ball
      self.attrModel "size", Size
      self.attrModels "pins", Pin
      
      instructions = """
        Click and Drag

        'r' to Restart Level
      """

      restartText = """
        Oops, didn't hit them all!

        Press 'r' to restart level
      """

      startPosition = currentPosition = null

      getPower = (a, b) ->
        1

      gameOver = false

      fadeStart = -1
      resetAt = 0
      fadeEnd = 1

      resetCount = 0
      skippableAt = 7
      
      outOfBounds = (object) ->
        p = object.position()

        (p.x < 0 or p.x > self.size().width) or
        (p.y < 0 or p.y > self.size().height)

      self.extend
        levelDisplayName: ->
          "#{I.chapter + 1} - #{self.levelName()}"

        levelNames: ->
          names = Object.keys(Chapters[I.chapter])

          return names

        currentLevelData: ->
          Chapters[I.chapter][self.levelName()]()

        resetLevel: ->
          resetCount += 1
          gameOver = false
          self.ball(null)

          # Reset pins
          self.pins self.currentLevelData()

        goToLevel: (name) ->
          return if fadeStart
          
          # TODO: AFTER COMPO: This is all gross
          fadeStart = I.age
          resetAt = I.age + 1
          fadeEnd = I.age + 2

          if name
            # Jump to a level by name
          else
            nextIndex = self.levelNames().indexOf(I.levelName) + 1
            name = self.levelNames()[nextIndex]

          if name
            I.levelName = name
          else
            self.nextChapter()
            
        nextChapter: ->
          I.chapter += 1

          if Chapters[I.chapter]
            name = self.levelNames().first()
            I.levelName = name
            self.goToLevel name
          else
            # TODO: Better winning message
            alert "a winner is you"

        touch: (position) ->
          # Check for skip button
          if (p = position.scale(self.size())) and (resetCount >= skippableAt)
            if 0 <= p.x <= 100
              if 0 <= p.y <= 30
                self.goToLevel() # Skip it!

          unless self.ball()
            startPosition = currentPosition = position.scale(self.size())
            
            startPosition.x = I.startZone

        move: (position) ->
          currentPosition = position.scale(self.size())

        release: (position) ->
          if startPosition
            currentPosition = position.scale(self.size())
      
            self.fire startPosition, currentPosition
      
            startPosition = currentPosition = null

        fire: (start, target) ->
          self.ball Ball
            position: start
            velocity: target.subtract(start).norm getPower(start, target) * 1600 + 1

        objects: ->
          if self.ball()
            self.pins().concat(self.ball())
          else
            self.pins()
        
        shouldRestart: ->
          if self.ball()
            if outOfBounds self.ball()
              self.pins().reduce (restart, pin) ->
                restart and !(pin.hit() and !outOfBounds(pin))
              , true

        update: (dt) ->
          if I.age > resetAt
            resetAt = undefined
            resetCount = 0
            self.resetLevel()

          if I.age > fadeEnd
            fadeStart = fadeEnd = null

          self.objects().invoke "update", dt

          unless gameOver
            self.processPhysics(self.objects(), dt)
  
            done = self.pins().reduce (done, pin) ->
              done and pin.hit()
            , true

            if done
              self.goToLevel() # Next level

          I.age += dt

        drawMessage: (message, canvas) ->
          message.split("\n").map (text, i) ->
            canvas.font "40px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif"

            canvas.centerText
              color: "pink"
              position: Point(0.5, 0.5).scale(self.size()).add Point(0, 50 * (i - 1) )
              text: text

        draw: (canvas) ->
          canvas.fill("red")
          canvas.fill
            x: 0
            y: 0
            width: I.startZone
            height: self.size().height
            color: "gray"

          fontSize = 32 + 6 * Math.sin(self.age() * 1.5 * Math.TAU)
          canvas.font "#{fontSize}px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif"

          if startPosition
            power = getPower(startPosition, currentPosition)
            
            canvas.drawCircle
              x: startPosition.x
              y: startPosition.y
              color: "blue"
              radius: 64
    
            canvas.drawLine
              start: startPosition
              end: currentPosition
              color: "black"

            angle = Point.direction(startPosition, currentPosition)/Math.TAU

            canvas.centerText
              color: "white"
              position: currentPosition
              text: "#{startPosition.y} #{angle.toFixed(4)}τ"
          else if self.ball()
            self.ball().draw canvas
          else if mousePosition
            canvas.drawCircle
              x: mousePosition.x
              y: mousePosition.y
              color: "blue"
              radius: 64

            canvas.centerText
              color: "white"
              position:
                x: I.startZone
                y: mousePosition.y
              text: "#{mousePosition.y}"
          
          self.pins.forEach (pin) ->
            pin.draw(canvas)

          if fadeStart
            x = (I.age - fadeStart) / (fadeEnd - fadeStart) * 2
            opacity = (-(x - 1) * (x - 1) + 1).clamp(0, 1)
            canvas.fill "rgba(0, 0, 0, #{opacity.toFixed(8)})"
          
          if resetCount >= skippableAt
            fontSize = 32 + 6 * Math.sin(self.age() * 1.5 * Math.TAU)
            canvas.font "#{fontSize}px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif"

            canvas.drawText
              position:
                x: 10
                y: 30
              text: "Skip"
              color: "white"

          if I.age < 5
            self.drawMessage instructions, canvas
          else if self.shouldRestart() and !fadeStart
            self.drawMessage restartText, canvas 

          # Level Name
          displayName = self.levelDisplayName()
          canvas.font "40px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif"
          canvas.drawText
            color: "white"
            text: displayName
            position:
              x: self.size().width - canvas.measureText(displayName) - 20
              y: self.size().height - 20

      # Hack for gosting on pointer devices
      mousePosition = null

      $("body").on "mousemove", (e) ->
        mousePosition = localPosition(e)
        mousePosition.x = mousePosition.x.clamp(0, I.startZone)
      
      localPosition = (e) ->
        $currentTarget = $("canvas")
        offset = $currentTarget.offset()
    
        point = Point(
          (e.pageX - offset.left)
          (e.pageY - offset.top)
        )
    
        return point

      self.goToLevel()

      return self
