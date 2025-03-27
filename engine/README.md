# chess engine in rust


wasm-pack build --target web 
## this will create a pkg folder with a .wasm file and a .js file
npm install ./engine/pkg  # install the package

import init from 'chess-engine' // import the package
init() // initialize the package
```

use the package in your code
```js
import init, {greet} from 'chess-engine'
init().then((engine) => {
    console.log(greet("hello from rust wasm"))
})
```