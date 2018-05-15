
A few notes: I am under a lot of time pressure here, so I have taken quite a few shortcuts. For example, everything consists of raw functions. OOP would probably be better suited for the board in Boggle. Furthermore, because of unclear requirements, I didnt use a grammar for the json like language. This results in code with more edge cases and is harder to adjust. Lastly, test coverage is probably at a minimum for what I would do on an actual project. Most tests are integration tests with little functional testing. Furthermore, since a lot of the requirements were unclear, I left stubs in for places when clarification would arrive and made guesses in other places.

I developed this using Node 8.9.1, please install a compatible version of node, and then run "npm install", followed by "npm test".

The output should be similar to:

  Tests for Boggle
    ✓ should export the needed functions
    ✓ expect the seed 0 to result in the expected board
    ✓ expect the solution to the board with seed 0 to be the expected solution (60ms)
    ✓ expect the seed 1 to result in the expected board
    ✓ expect the solution to the board with seed 1 to be the expected solution
    ✓ expect the seed 1256 to result in the expected board
    ✓ expect the solution to the board with seed 1256 to be the expected solution
    ✓ expect the seed 2 to result in the expected board
    ✓ expect the solution to the board with seed 2 to be the expected solution
    ✓ expect the seed 2256 to result in the expected board
    ✓ expect the solution to the board with seed 2256 to be the expected solution (41ms)
    ✓ expect the seed 256 to result in the expected board
    ✓ expect the solution to the board with seed 256 to be the expected solution
    ✓ expect the seed 3 to result in the expected board
    ✓ expect the solution to the board with seed 3 to be the expected solution (38ms)
    ✓ expect the seed 4 to result in the expected board
    ✓ expect the solution to the board with seed 4 to be the expected solution
    ✓ expect the seed 5 to result in the expected board
    ✓ expect the solution to the board with seed 5 to be the expected solution
    ✓ expect the seed 6 to result in the expected board
    ✓ expect the solution to the board with seed 6 to be the expected solution
    ✓ expect the seed 7 to result in the expected board
    ✓ expect the solution to the board with seed 7 to be the expected solution
    ✓ expect the seed 8 to result in the expected board
    ✓ expect the solution to the board with seed 8 to be the expected solution
    ✓ expect the seed 8256 to result in the expected board
    ✓ expect the solution to the board with seed 8256 to be the expected solution
    ✓ expect the seed 9 to result in the expected board
    ✓ expect the solution to the board with seed 9 to be the expected solution

  Tests for chessboard
    ✓ should export CalculateContainedWater
    ✓ diagonals.txt
    ✓ nested_square_container.txt
    ✓ nested_square_container_inverted.txt
    ✓ open_square_down.txt
    ✓ open_square_left.txt
    ✓ open_square_right.txt
    ✓ open_square_up.txt
    ✓ square.txt

  Tests for json_formatting
    ✓ should export visualize_data
    ✓ parse_value: 123 should equal 123
    ✓ parse_value: True should equal true
    ✓ parse_value: tRuE should equal true
    ✓ parse_value: true should equal true
    ✓ parse_value: trueb should equal true
    ✓ parse_value: False should equal false
    ✓ parse_value: fAlSe should equal false
    ✓ parse_value: false should equal false
    ✓ parse_value: falsea should equal false
    ✓ parse_value: 123.5 should equal 123.5
    ✓ parse_value: 123.5a should equal 123.5
    ✓ parse_string: "test" should equal "test"
    ✓ parse_string: "this is a"test should equal "this is a"
    ✓ parse_array: [True,1,"test",4] should equal [true,1,"test",4]
    ✓ parse_array: [] should equal []
    ✓ parse_array: [,] should equal []
    ✓ parse_object: {"1": 2, "test": "True","truthy": True} should equal {"1":2,"test":"True","truthy":true}
    ✓ parse_object: {"foo":{"bar":{,},"baz":1},} should equal {"foo":{"bar":{},"baz":1}}
    ✓ parse_object: {,} should equal {}
    ✓ parse_data: [True,1,"test",4] should equal [true,1,"test",4]
    ✓ parse_data: [] should equal []
    ✓ parse_data: [,] should equal []
    ✓ parse_data: "test" should equal "test"
    ✓ parse_data: "this is a"test should equal "this is a"
    ✓ parse_data: {"1": 2, "test": "True","truthy": True} should equal {"1":2,"test":"True","truthy":true}
    ✓ parse_data: {"foo":{"bar":{,},"baz":1},} should equal {"foo":{"bar":{},"baz":1}}
    ✓ parse_data: {,} should equal {}
    ✓ sample_testcase.json
    ✓ truthy_testcase.json

  Tests for Wallclock
    ✓ should be exported
    ✓ 12:00 should equal 0 degrees
    ✓ 12:15 should equal 82.5 degrees
    ✓ 12:30 should equal 165 degrees
    ✓ 12:45 should equal 247.5 degrees
    ✓ 11:00 should equal 330 degrees
    ✓ 11:15 should equal 247.5 degrees
    ✓ 11:30 should equal 165 degrees
    ✓ 11:45 should equal 82.49999999999999 degrees
    ✓ 6:00 should equal 180 degrees
    ✓ 6:15 should equal 97.50000000000001 degrees
    ✓ 6:30 should equal 14.999999999999986 degrees
    ✓ 6:45 should equal 67.5 degrees


  81 passing (517ms)