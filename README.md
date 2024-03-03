# Elevator Game!

This project simulates a building elevator. It displays a building on the left and a button panel on the right.
The elevator will respond to button clicks after a short delay. While it is moving it turns grey and when it arrives at the destination
it turns black. You can request multiple floors or add floors while it is moving. Once it has set the next
destination, it will travel to it before finding the next stop. The next stop is determined to be the closest to the current floor
regardless of which direction it is in.

### Algorithm
To access the elevator algorithms you can run the [tests](src/util/SearchUtil.test.ts). There is a test `Return Stat for trip`
that will list out the closest stops and the total time. (example output below). 

I have written two separate algorithms which both return the same results. Each has it's own merits.
The first is a binary search and the second is constant time algorithm.

> Binary Search
1. Take in a list of destinations and the current floor
2. Sort the list if destinations lowest -> highest
3. Split the destination list in half (left and right)
4. Find which is closer to current floor, either the last element of left or the first element of right
5. Which ever list is closer calls this same function with the new list and current floor
6. The process repeats until the destination list is two elements
7. Determine which is the closer of the final two elements and return it

> Constant Time Search
1. Take a list of destinations and the current floor
2. Create a new array by adding current floor and destination list 
3. Sort the new list lowest -> highest
4. Find the index of current floor
5. Get the destinations on either side of current floor `list[current-1] list[current+1]`
6. Determine which is the closer of the final two elements and return it

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

