class Father {
    constructor () {
        this.name = 'father'
    }
    getName () {
        console.log(this.name)
    }
}
class Son extends Father {
    constructor () {
        super()
        this.name2 = 'fake'
    }
    test () {
        this.getName()
    }
}
new Son().test()