def ("Person") ({
    __init__: function (name) {
        this.name = name;
    },

    speak: function (text) {
        alert(text || "Hi, my name is " + this.name);
    }
});

def ("Friend") << Person ({
    __init__: function (name) {
	    this.__super__(Person, name)
    },

    kick: function () {
        this.speak("I kick u!");
    }
});

def ("Ninja") << Friend ({
    __init__: function (name) {
	    Friend.__init__(name)
    },

    kick: function () {
        this.speak("I kick u!");
    }
});

var ninjy = new Ninja("JDD");

ninjy.speak();
ninjy.kick();