# Elevator Game!

This project simulates a building elevator. It displays a building on the left and a button panel on the right.
The elevator will respond to button clicks after a short delay. The delay is there to simulate a real elevator and 
allow the user to press a few buttons before the elevator takes off. The elevator will then try to move in one 
direction and exhaust all requests in that direction before turning in the opposite direction and completing
those requests. You can play with this by selecting a few floors like 6,7,11,12 and then when the elevator
starts moving try adding 1,2,3 to the list. 

### Algorithm
To access the elevator algorithms you can run the [tests](src/util/SearchUtil.test.ts). There is a test `Return Stat for trip`
that will list out the closest stops and the total time. (example output below). 

The core algorithm is a binary search. Given a starting floor, `currentFloor` and an unsorted array of `destinations`, 
the binary sort will: 
1. sort the array
2. split the destinations array in half
3. locate the half which `currentFloor` is contained in `(currentFloor < array[len] && currentFloor > array[0])`  
4. recursively call itself with the smaller array and continue until `destinations` is only two items
5. Once there are two items left we simply find the delta with `currentFloor` and return the closest.
   (In a tie situation the default is to the lower floor)

```
{
      currentFloor: 1,
      destinations: [2, 4, 6, 7, 8, 12, 15, 19, 20, 24],
      totalTime: 230
}
```

This project is built with `yarn | vite | React | Typescript` 

## Build
To start the web app you should be able to do a `yarn install` followed by `yarn dev`. 
Then open a browser to `http://localhost:5173/`

## Tests
The tests can be run from the command line (`yarn run test`) or from your IDE. 
They are located here [Tests](src/util/SearchUtil.test.ts)


## Code
This React/TypeScript project was built relying heavily on the `useReducer` React Hook as a state machine. I did this
because state management can often be difficult in React apps and I wanted to see how I could effectively build
a game with the core of it using a state machine. I think it worked well for the most part. I was able to centralize my
logic in the state machine and in those code blocks I was able to contextualize what was happening in the app at that moment.

## The Game
The game is hosted on Vercel. You can play it here:
https://building-elevator.vercel.app/

![img.png](img.png)

