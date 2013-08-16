# def

def - A simple Ruby-style inheritance for JavaScript


## Dependencies

```
ECMAScript 5: Object.create
```


## Example

```js
def ('Person') ({
    __init__: function (name) {
        this.name = name;
    },

    speak: function (text) {
        alert(text || 'Hi, my name is ' + this.name);
    }
});

def ('Friend') << Person ({
    kick: function () {
        this.speak("I kick u!");
    }
});

def ('Ninja') << Friend ({
    __init__: function (name) {
	    Friend.__init__(name)
    },

    kick: function () {
        this.speak('I kick u!');
    }
});

var ninjy = new Ninja("John");

ninjy.speak();
ninjy.kick();
```
















##

* Include library is licensed under the MIT (MIT_LICENSE.txt) license

* Copyright (c) 2013 [Alexander Guinness] (https://github.com/monolithed)