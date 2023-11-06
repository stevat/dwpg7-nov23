# dwpg7-nov23
Cinema tickets exercise

Built to fulfil the design brief - installation instructions follow below.

## Running ##


1. From the base directory, install the dependencies

    ```
    npm install
    ```

1. Unit tests can be ran in Jest using the command:
    ```
    npm run test
    ```

## Notation ##

Process flow :

1. Validates the potential failures immediately in sequence - my intention was to build them into middleware in an app, but I ran out of time.
1. Valid account ID
1. Valid no of tickets within the boundary set in the brief (0-20)
1. Validate the presence of at least one adult
1. Ensure that adults are more prevalent than infants seeing as they're sitting on laps.

Then we moved into the actual processing
1. Calculate reservation count and simultaneously calculate payment in a switch
1. Execute calls to the existing services for reservation and payment.