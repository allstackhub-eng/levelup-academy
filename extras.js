// ==================== LESSON EXTRAS: Quizzes, Assignments & Resources ====================
// Merged into WEEKS lessons at load time by lesson ID

const LESSON_EXTRAS = {
  // ==================== WEEK 1 ====================
  'w1l1': {
    assignments: [
      { prompt: 'Print 5 different lines: your name, age, school, hobby, and a fun fact.', difficulty: 'easy', xp: 5,
        hint: 'Use 5 separate print() statements.',
        validator: (code) => (code.match(/print\s*\(/g) || []).length >= 5 ? { success: true, message: '5 prints! Great job!' } : { success: false, message: 'Use at least 5 print() statements.' } },
      { prompt: 'Print a short poem (at least 4 lines) using print(). Make it about coding!', difficulty: 'easy', xp: 5,
        hint: 'Each line of the poem gets its own print().',
        validator: (code) => (code.match(/print\s*\(/g) || []).length >= 4 ? { success: true, message: 'Beautiful code poetry!' } : { success: false, message: 'Print at least 4 lines.' } },
      { prompt: 'Use print() to display a math problem and its answer. For example: print("5 + 3 =", 5 + 3)', difficulty: 'easy', xp: 5,
        hint: 'You can mix text and math inside print().',
        validator: (code) => code.includes('print') && (code.includes('+') || code.includes('*') || code.includes('-')) ? { success: true, message: 'Math + code = awesome!' } : { success: false, message: 'Include a math operation in your print.' } },
    ],
    quiz: [
      { question: 'What function do we use to display text on screen in Python?', options: ['display()', 'print()', 'show()', 'write()'], correct: 1, explanation: 'print() is the built-in function for output in Python.' },
      { question: 'What is the correct syntax to print "Hello"?', options: ['print Hello', 'print("Hello")', 'Print("Hello")', 'echo("Hello")'], correct: 1, explanation: 'Python is case-sensitive and requires parentheses.' },
      { question: 'What will print(2 + 3) display?', options: ['"2 + 3"', '5', '23', 'Error'], correct: 1, explanation: 'Python evaluates the math expression first, then prints the result.' },
      { question: 'Which of these will cause an error?', options: ['print("Hi")', 'print(42)', 'print("Age:", 13)', 'print("Hi)'], correct: 3, explanation: 'Missing closing quote causes a SyntaxError.' },
    ],
    resources: [
      { title: 'Python print() - Official Docs', url: 'https://docs.python.org/3/library/functions.html#print', description: 'The official documentation for print()', icon: '📘' },
      { title: 'Python for Beginners - W3Schools', url: 'https://www.w3schools.com/python/python_syntax.asp', description: 'Interactive Python basics tutorial', icon: '🌐' },
      { title: 'Automate the Boring Stuff - Chapter 1', url: 'https://automatetheboringstuff.com/2e/chapter1/', description: 'Free online book - great for beginners', icon: '📖' },
    ]
  },
  'w1l2': {
    assignments: [
      { prompt: 'Create variables for a game character: name, health (100), attack_power, and defense. Print all stats.', difficulty: 'easy', xp: 5,
        hint: 'health = 100, then print all variables.',
        validator: (code) => (code.match(/=/g) || []).length >= 4 && code.includes('print') ? { success: true, message: 'Game character created!' } : { success: false, message: 'Create 4+ variables and print them.' } },
      { prompt: 'Create two number variables. Calculate and print their sum, difference, product, and quotient.', difficulty: 'medium', xp: 8,
        hint: 'Use +, -, *, and / operators.',
        validator: (code) => code.includes('+') && code.includes('-') && code.includes('*') && code.includes('/') ? { success: true, message: 'All 4 operations done!' } : { success: false, message: 'Use all 4 math operators: + - * /' } },
      { prompt: 'Create a variable called price = 19.99. Apply a 20% discount and print the new price.', difficulty: 'medium', xp: 8,
        hint: 'new_price = price * 0.8  or  price - (price * 0.20)',
        validator: (code) => code.includes('price') && code.includes('print') && (code.includes('0.8') || code.includes('0.2') || code.includes('20')) ? { success: true, message: 'Discount calculated!' } : { success: false, message: 'Calculate the discount using multiplication.' } },
    ],
    quiz: [
      { question: 'What is a variable in Python?', options: ['A type of function', 'A named container for storing data', 'A math equation', 'A type of loop'], correct: 1, explanation: 'Variables store data values that can be used and changed later.' },
      { question: 'Which variable name is INVALID in Python?', options: ['my_name', '_score', '2players', 'player2'], correct: 2, explanation: 'Variable names cannot start with a number.' },
      { question: 'What does x = x + 5 do?', options: ['Creates a new variable called x+5', 'Adds 5 to the current value of x', 'Checks if x equals x+5', 'Causes an error'], correct: 1, explanation: 'It takes the current value of x, adds 5, and stores the result back in x.' },
      { question: 'What is the value of result after: a = 10, b = 3, result = a % b?', options: ['3.33', '1', '3', '30'], correct: 1, explanation: '% is the modulo operator. 10 % 3 = 1 (remainder of 10 divided by 3).' },
    ],
    resources: [
      { title: 'Python Variables - W3Schools', url: 'https://www.w3schools.com/python/python_variables.asp', description: 'Interactive guide to Python variables', icon: '🌐' },
      { title: 'Python Data Types', url: 'https://realpython.com/python-data-types/', description: 'Deep dive into strings, integers, floats, and booleans', icon: '📖' },
      { title: 'Variable Naming Best Practices', url: 'https://peps.python.org/pep-0008/#naming-conventions', description: 'PEP 8 style guide for naming', icon: '📘' },
    ]
  },
  'w1l3': {
    assignments: [
      { prompt: 'Create a tip calculator. Set meal_cost = 45.50 and tip_percent = 18. Calculate and print the tip and total.', difficulty: 'easy', xp: 5,
        hint: 'tip = meal_cost * (tip_percent / 100)',
        validator: (code) => code.includes('*') && code.includes('print') && code.includes('=') ? { success: true, message: 'Tip calculator works!' } : { success: false, message: 'Calculate the tip using multiplication.' } },
      { prompt: 'Convert a temperature from Celsius to Fahrenheit. Formula: F = C * 9/5 + 32. Test with 25 degrees C.', difficulty: 'medium', xp: 8,
        hint: 'fahrenheit = celsius * 9/5 + 32',
        validator: (code) => code.includes('9') && code.includes('5') && code.includes('32') && code.includes('print') ? { success: true, message: 'Temperature converted!' } : { success: false, message: 'Use the formula F = C * 9/5 + 32' } },
      { prompt: 'Calculate the area and perimeter of a rectangle with width=12 and height=8. Use f-strings to display results nicely.', difficulty: 'medium', xp: 8,
        hint: 'area = width * height, perimeter = 2 * (width + height)',
        validator: (code) => code.includes('*') && code.includes('+') && code.includes('print') ? { success: true, message: 'Geometry master!' } : { success: false, message: 'Calculate area (w*h) and perimeter 2*(w+h).' } },
    ],
    quiz: [
      { question: 'What is the result of 17 // 5 in Python?', options: ['3.4', '3', '2', '4'], correct: 1, explanation: '// is integer (floor) division. 17 // 5 = 3 (drops the decimal).' },
      { question: 'What is the result of 2 ** 3?', options: ['6', '8', '5', '23'], correct: 1, explanation: '** is the exponent operator. 2 ** 3 = 2 x 2 x 2 = 8.' },
      { question: 'What does this print? print(10 + 5 * 2)', options: ['30', '20', '25', '15'], correct: 1, explanation: 'Python follows order of operations: multiplication first, then addition. 5*2=10, then 10+10=20.' },
      { question: 'How do you get the remainder of 10 divided by 3?', options: ['10 / 3', '10 // 3', '10 % 3', '10 ** 3'], correct: 2, explanation: '% is the modulo operator that gives the remainder.' },
    ],
    resources: [
      { title: 'Python Operators', url: 'https://www.w3schools.com/python/python_operators.asp', description: 'All Python operators explained with examples', icon: '🌐' },
      { title: 'Math Module in Python', url: 'https://docs.python.org/3/library/math.html', description: 'Advanced math functions: sqrt, sin, cos, pi', icon: '📘' },
    ]
  },
  'w1l4': {
    assignments: [
      { prompt: 'Create a Mad Libs game! Use input() to get a noun, verb, and adjective. Print a funny sentence using them.', difficulty: 'easy', xp: 5,
        hint: 'noun = input("Enter a noun: "), then build a sentence with f-strings.',
        validator: (code) => (code.match(/input\s*\(/g) || []).length >= 3 && code.includes('print') ? { success: true, message: 'Fun Mad Libs game!' } : { success: false, message: 'Use at least 3 input() calls and print the result.' } },
      { prompt: 'Ask the user for their birth year. Calculate and print their age. Handle the year as a number!', difficulty: 'medium', xp: 8,
        hint: 'Use int(input(...)) to convert the input to a number. Subtract from 2025.',
        validator: (code) => code.includes('int') && code.includes('input') && code.includes('print') ? { success: true, message: 'Age calculator done!' } : { success: false, message: 'Use int(input()) and subtract from current year.' } },
    ],
    quiz: [
      { question: 'What does input() return by default?', options: ['An integer', 'A float', 'A string', 'A boolean'], correct: 2, explanation: 'input() always returns a string. Use int() or float() to convert.' },
      { question: 'How do you get a number from the user?', options: ['number(input("Enter: "))', 'int(input("Enter: "))', 'input(int("Enter: "))', 'input("Enter: ").number()'], correct: 1, explanation: 'Wrap input() with int() to convert the string to an integer.' },
      { question: 'What happens if you try int("hello")?', options: ['Returns 0', 'Returns "hello"', 'Causes a ValueError', 'Returns None'], correct: 2, explanation: '"hello" cannot be converted to a number, so Python raises a ValueError.' },
    ],
    resources: [
      { title: 'Python Input/Output', url: 'https://www.w3schools.com/python/python_user_input.asp', description: 'How to get and use user input', icon: '🌐' },
      { title: 'String Formatting (f-strings)', url: 'https://realpython.com/python-f-strings/', description: 'Master f-strings for clean output', icon: '📖' },
    ]
  },
  'w1l5': {
    assignments: [
      { prompt: 'Build a detailed bio card with: name, age, grade, 3 hobbies, favorite quote, and a fun ASCII art border around it.', difficulty: 'medium', xp: 10,
        hint: 'Use print("=" * 30) for borders. Use variables for all the data.',
        validator: (code) => (code.match(/print\s*\(/g) || []).length >= 6 && code.includes('=') ? { success: true, message: 'Amazing bio card!' } : { success: false, message: 'Print at least 6 lines with variable data.' } },
    ],
    quiz: [
      { question: 'Which of these creates a valid string variable?', options: ['name = Alex', 'name = "Alex"', 'name = (Alex)', '"name" = Alex'], correct: 1, explanation: 'Strings must be wrapped in quotes.' },
      { question: 'What does print("Hi" * 3) output?', options: ['Hi3', 'HiHiHi', 'Hi Hi Hi', 'Error'], correct: 1, explanation: 'The * operator repeats a string. "Hi" * 3 = "HiHiHi".' },
      { question: 'How do you include a variable in a print statement?', options: ['print("Score is" + score)', 'print(f"Score is {score}")', 'print("Score is", score)', 'All of the above'], correct: 3, explanation: 'All three methods work: concatenation, f-strings, and comma separation.' },
    ],
    resources: [
      { title: 'Python String Methods', url: 'https://www.w3schools.com/python/python_ref_string.asp', description: 'Complete reference of all string methods', icon: '🌐' },
    ]
  },

  // ==================== WEEK 2 ====================
  'w2l1': {
    assignments: [
      { prompt: 'Create a login system: ask for username and password. Only print "Access Granted" if both match your stored values.', difficulty: 'medium', xp: 8,
        hint: 'Use if username == stored_user and password == stored_pass:',
        validator: (code) => code.includes('if') && code.includes('and') && code.includes('input') ? { success: true, message: 'Login system built!' } : { success: false, message: 'Use if with and to check both conditions.' } },
      { prompt: 'Write a program that checks if a number is positive, negative, or zero using if/elif/else.', difficulty: 'easy', xp: 5,
        hint: 'if num > 0: ... elif num < 0: ... else: ...',
        validator: (code) => code.includes('if') && code.includes('elif') && code.includes('else') ? { success: true, message: 'Number checker works!' } : { success: false, message: 'Use if, elif, and else.' } },
    ],
    quiz: [
      { question: 'What does == mean in Python?', options: ['Assignment', 'Equals (comparison)', 'Not equals', 'Approximately equals'], correct: 1, explanation: '== compares two values. = assigns a value.' },
      { question: 'What keyword handles a third condition after if and elif?', options: ['then', 'otherwise', 'else', 'default'], correct: 2, explanation: 'else catches everything not matched by if or elif.' },
      { question: 'What does "and" do in: if x > 0 and x < 10?', options: ['Checks if either is true', 'Checks if both are true', 'Adds x and 10', 'Creates a range'], correct: 1, explanation: '"and" requires BOTH conditions to be True.' },
      { question: 'What will this print? if 5 > 3: print("Yes") else: print("No")', options: ['Yes', 'No', 'YesNo', 'Error - missing colon'], correct: 0, explanation: '5 > 3 is True, so "Yes" is printed.' },
    ],
    resources: [
      { title: 'Python If...Else', url: 'https://www.w3schools.com/python/python_conditions.asp', description: 'Complete guide to conditional statements', icon: '🌐' },
      { title: 'Boolean Logic Explained', url: 'https://realpython.com/python-boolean/', description: 'Understanding True, False, and, or, not', icon: '📖' },
    ]
  },
  'w2l2': {
    assignments: [
      { prompt: 'Print all even numbers from 1 to 50 using a for loop. Print them on one line separated by spaces.', difficulty: 'easy', xp: 5,
        hint: 'for i in range(2, 51, 2): print(i, end=" ")',
        validator: (code) => code.includes('for') && code.includes('range') && code.includes('print') ? { success: true, message: 'Even numbers printed!' } : { success: false, message: 'Use for with range().' } },
      { prompt: 'Create a multiplication table for any number (1-12) using a for loop.', difficulty: 'medium', xp: 8,
        hint: 'for i in range(1, 13): print(f"{num} x {i} = {num * i}")',
        validator: (code) => code.includes('for') && code.includes('*') && code.includes('print') ? { success: true, message: 'Multiplication table done!' } : { success: false, message: 'Use a for loop with multiplication.' } },
      { prompt: 'Calculate the sum of all numbers from 1 to 100 using a for loop. Print the total.', difficulty: 'easy', xp: 5,
        hint: 'total = 0, then loop and add each number.',
        validator: (code) => code.includes('for') && code.includes('+') ? { success: true, message: 'Sum calculated!' } : { success: false, message: 'Use a for loop to add numbers.' } },
    ],
    quiz: [
      { question: 'What does range(5) produce?', options: ['1,2,3,4,5', '0,1,2,3,4', '0,1,2,3,4,5', '5'], correct: 1, explanation: 'range(5) starts at 0 and goes up to (but not including) 5.' },
      { question: 'How many times does this loop run? for i in range(2, 10, 3):', options: ['3 times', '8 times', '4 times', '10 times'], correct: 0, explanation: 'range(2,10,3) gives 2, 5, 8 = 3 values.' },
      { question: 'What is the purpose of the "step" in range(start, stop, step)?', options: ['It sets the starting value', 'It determines how much to increment', 'It sets the ending value', 'It counts backwards'], correct: 1, explanation: 'The step determines how much to add each iteration.' },
    ],
    resources: [
      { title: 'Python For Loops', url: 'https://www.w3schools.com/python/python_for_loops.asp', description: 'For loops with range, lists, and strings', icon: '🌐' },
      { title: 'Python range() Explained', url: 'https://realpython.com/python-range/', description: 'Deep dive into the range function', icon: '📖' },
    ]
  },
  'w2l3': {
    assignments: [
      { prompt: 'Create a password validator: keep asking for a password until the user enters the correct one. Count attempts.', difficulty: 'medium', xp: 8,
        hint: 'while password != correct_password: ask again. Use a counter variable.',
        validator: (code) => code.includes('while') && code.includes('input') ? { success: true, message: 'Password validator built!' } : { success: false, message: 'Use a while loop with input().' } },
      { prompt: 'Write a countdown from 10 to 1 using a while loop, then print "LIFTOFF!"', difficulty: 'easy', xp: 5,
        hint: 'count = 10, while count > 0: print, count -= 1',
        validator: (code) => code.includes('while') && code.includes('print') ? { success: true, message: 'Liftoff!' } : { success: false, message: 'Use a while loop for the countdown.' } },
    ],
    quiz: [
      { question: 'When does a while loop stop?', options: ['After running once', 'When its condition becomes False', 'After 10 iterations', 'When you press Stop'], correct: 1, explanation: 'A while loop continues as long as its condition is True.' },
      { question: 'What happens with: while True: print("hi")?', options: ['Prints "hi" once', 'Prints "hi" forever (infinite loop)', 'Causes an error', 'Prints nothing'], correct: 1, explanation: 'while True creates an infinite loop since the condition is always True.' },
      { question: 'What does "break" do inside a loop?', options: ['Pauses the loop', 'Exits the loop immediately', 'Skips to the next iteration', 'Breaks the program'], correct: 1, explanation: 'break immediately exits the current loop.' },
    ],
    resources: [
      { title: 'Python While Loops', url: 'https://www.w3schools.com/python/python_while_loops.asp', description: 'While loops, break, continue explained', icon: '🌐' },
    ]
  },
  'w2l4': {
    assignments: [
      { prompt: 'Create a list of 5 friends. Add 2 more with append(). Remove 1. Sort the list and print it.', difficulty: 'easy', xp: 5,
        hint: 'friends = ["name1", ...]. Use .append(), .remove(), .sort()',
        validator: (code) => code.includes('append') && code.includes('sort') ? { success: true, message: 'List operations mastered!' } : { success: false, message: 'Use append() and sort().' } },
      { prompt: 'Create a list of 10 random numbers. Find and print the min, max, sum, and average.', difficulty: 'medium', xp: 8,
        hint: 'Use min(), max(), sum(), and len() functions.',
        validator: (code) => code.includes('min') || code.includes('max') || code.includes('sum') ? { success: true, message: 'Statistics calculated!' } : { success: false, message: 'Use min(), max(), and sum().' } },
      { prompt: 'Use a for loop to iterate through a list of scores and print only those above 80.', difficulty: 'medium', xp: 8,
        hint: 'for score in scores: if score > 80: print(score)',
        validator: (code) => code.includes('for') && code.includes('if') && code.includes('[') ? { success: true, message: 'Filtered the list!' } : { success: false, message: 'Use a for loop with an if condition.' } },
    ],
    quiz: [
      { question: 'How do you create an empty list in Python?', options: ['list = ()', 'list = []', 'list = {}', 'list = empty'], correct: 1, explanation: 'Square brackets [] create a list. () is a tuple, {} is a dict.' },
      { question: 'What does my_list.append("new") do?', options: ['Adds "new" at the beginning', 'Adds "new" at the end', 'Replaces the first item', 'Creates a new list'], correct: 1, explanation: 'append() adds an element to the END of the list.' },
      { question: 'How do you access the LAST element of a list?', options: ['my_list[last]', 'my_list[-1]', 'my_list[0]', 'my_list.last()'], correct: 1, explanation: 'Negative indexing: -1 is the last element, -2 is second to last, etc.' },
      { question: 'What does len([1, 2, 3, 4]) return?', options: ['3', '4', '10', '[1,2,3,4]'], correct: 1, explanation: 'len() returns the number of elements in the list.' },
    ],
    resources: [
      { title: 'Python Lists', url: 'https://www.w3schools.com/python/python_lists.asp', description: 'Complete guide to Python lists', icon: '🌐' },
      { title: 'List Methods Reference', url: 'https://docs.python.org/3/tutorial/datastructures.html', description: 'Official Python list tutorial', icon: '📘' },
    ]
  },
  'w2l5': {
    assignments: [
      { prompt: 'Enhance the number guessing game: add difficulty levels (easy=10 tries, medium=5, hard=3). Track the score.', difficulty: 'hard', xp: 12,
        hint: 'Ask for difficulty first, set max_tries based on choice.',
        validator: (code) => code.includes('if') && code.includes('while') && code.includes('random') ? { success: true, message: 'Advanced guessing game!' } : { success: false, message: 'Use if for difficulty, while for guessing, random for the number.' } },
    ],
    quiz: [
      { question: 'Which module provides random number generation?', options: ['math', 'random', 'numbers', 'rand'], correct: 1, explanation: 'The random module has functions like randint(), choice(), etc.' },
      { question: 'What does random.randint(1, 10) return?', options: ['Always 1 or 10', 'A random integer from 1 to 10', 'A random float from 1 to 10', 'A list of 10 numbers'], correct: 1, explanation: 'randint(a, b) returns a random integer N where a <= N <= b.' },
      { question: 'To use the random module, what must you write first?', options: ['use random', 'include random', 'import random', 'require random'], correct: 2, explanation: 'You must import a module before using it.' },
    ],
    resources: [
      { title: 'Python Random Module', url: 'https://www.w3schools.com/python/module_random.asp', description: 'All random functions explained', icon: '🌐' },
      { title: 'Build Games with Python', url: 'https://realpython.com/beginners-guide-python-turtle/', description: 'Visual game programming with Turtle', icon: '🎮' },
    ]
  },

  // ==================== WEEK 3 ====================
  'w3l1': {
    assignments: [
      { prompt: 'Write a function called is_even(n) that returns True if n is even, False otherwise. Test it with 5 numbers.', difficulty: 'easy', xp: 5,
        hint: 'return n % 2 == 0',
        validator: (code) => code.includes('def') && code.includes('return') && code.includes('%') ? { success: true, message: 'Even checker function works!' } : { success: false, message: 'Create a function with def that returns True/False.' } },
      { prompt: 'Create a function celsius_to_fahrenheit(c) and another fahrenheit_to_celsius(f). Test both.', difficulty: 'medium', xp: 8,
        hint: 'F = C * 9/5 + 32 and C = (F - 32) * 5/9',
        validator: (code) => (code.match(/def /g) || []).length >= 2 ? { success: true, message: 'Temperature converter functions done!' } : { success: false, message: 'Create 2 functions with def.' } },
    ],
    quiz: [
      { question: 'What keyword starts a function definition?', options: ['func', 'function', 'def', 'define'], correct: 2, explanation: 'def is short for "define" and starts a function definition.' },
      { question: 'What does "return" do in a function?', options: ['Prints a value', 'Sends a value back to the caller', 'Ends the program', 'Creates a variable'], correct: 1, explanation: 'return sends a value back from the function to wherever it was called.' },
      { question: 'What is a parameter?', options: ['The result of a function', 'A variable that receives input when the function is called', 'The name of a function', 'A type of loop'], correct: 1, explanation: 'Parameters are the variables listed in the function definition that receive values when called.' },
    ],
    resources: [
      { title: 'Python Functions', url: 'https://www.w3schools.com/python/python_functions.asp', description: 'Functions, parameters, and return values', icon: '🌐' },
      { title: 'Clean Code - Functions', url: 'https://realpython.com/defining-your-own-python-function/', description: 'Best practices for writing functions', icon: '📖' },
    ]
  },
  'w3l2': {
    assignments: [
      { prompt: 'Write a function that takes a list of numbers and returns a dictionary with keys "min", "max", "avg", and "sum".', difficulty: 'medium', xp: 8,
        hint: 'def stats(numbers): return {"min": min(numbers), ...}',
        validator: (code) => code.includes('def') && code.includes('return') && code.includes('{') ? { success: true, message: 'Stats function done!' } : { success: false, message: 'Create a function that returns a dictionary.' } },
    ],
    quiz: [
      { question: 'What is a default parameter?', options: ['A parameter that is always required', 'A parameter with a pre-set value if none is given', 'The first parameter', 'A global variable'], correct: 1, explanation: 'Default parameters have fallback values: def greet(name="World")' },
      { question: 'What is variable scope?', options: ['How far a variable can count', 'Where a variable can be accessed in the code', 'The type of a variable', 'How long a variable lives'], correct: 1, explanation: 'Scope determines where a variable is visible - inside a function (local) or everywhere (global).' },
      { question: 'Can a function call another function?', options: ['No, never', 'Yes, and this is very common', 'Only if they are in the same file', 'Only built-in functions'], correct: 1, explanation: 'Functions can call other functions, which is fundamental to programming.' },
    ],
    resources: [
      { title: 'Scope & Namespaces', url: 'https://realpython.com/python-scope-legb-rule/', description: 'Understanding LEGB scope rule', icon: '📖' },
    ]
  },
  'w3l3': {
    assignments: [
      { prompt: 'Write a function that counts vowels and consonants in a string. Return both counts.', difficulty: 'medium', xp: 8,
        hint: 'Loop through each character, check if it is in "aeiou".',
        validator: (code) => code.includes('def') && code.includes('for') && (code.includes('aeiou') || code.includes('vowel')) ? { success: true, message: 'Vowel counter works!' } : { success: false, message: 'Create a function that loops through characters.' } },
      { prompt: 'Create a password strength checker: weak (< 6 chars), medium (6-10), strong (> 10 with numbers and uppercase).', difficulty: 'hard', xp: 12,
        hint: 'Use len(), .isupper(), .isdigit() or check with any().',
        validator: (code) => code.includes('def') && code.includes('len') && code.includes('if') ? { success: true, message: 'Password checker built!' } : { success: false, message: 'Use def, len(), and if statements.' } },
    ],
    quiz: [
      { question: 'What does "hello".upper() return?', options: ['"Hello"', '"HELLO"', '"hello"', 'Error'], correct: 1, explanation: '.upper() converts all characters to uppercase.' },
      { question: 'What does "Hello World".split() return?', options: ['"H e l l o"', '["Hello", "World"]', '["H","e","l","l","o"]', '"HelloWorld"'], correct: 1, explanation: '.split() splits a string by spaces into a list of words.' },
      { question: 'What is an f-string?', options: ['A fast string', 'A formatted string that allows embedding expressions', 'A function string', 'A file string'], correct: 1, explanation: 'f-strings let you embed variables: f"Hello {name}"' },
    ],
    resources: [
      { title: 'Python String Methods', url: 'https://www.w3schools.com/python/python_ref_string.asp', description: 'All 40+ string methods with examples', icon: '🌐' },
      { title: 'Regular Expressions', url: 'https://docs.python.org/3/howto/regex.html', description: 'Advanced text pattern matching', icon: '📘' },
    ]
  },
  'w3l4': {
    assignments: [
      { prompt: 'Create a contact book dictionary. Add 5 contacts with name as key and phone number as value. Add search functionality.', difficulty: 'medium', xp: 8,
        hint: 'contacts = {"Alice": "555-1234", ...}. Use if name in contacts: to search.',
        validator: (code) => code.includes('{') && code.includes(':') && code.includes('if') ? { success: true, message: 'Contact book works!' } : { success: false, message: 'Use a dictionary with if for searching.' } },
    ],
    quiz: [
      { question: 'How do you create a dictionary?', options: ['dict = []', 'dict = ()', 'dict = {}', 'dict = ""'], correct: 2, explanation: 'Curly braces {} create a dictionary. Add key:value pairs inside.' },
      { question: 'How do you access the value for key "name" in a dict?', options: ['dict.name', 'dict["name"]', 'dict(name)', 'dict->name'], correct: 1, explanation: 'Use square brackets with the key: dict["name"]' },
      { question: 'What does .keys() return?', options: ['All values', 'All keys', 'The first key', 'The dictionary length'], correct: 1, explanation: '.keys() returns all the keys in the dictionary.' },
    ],
    resources: [
      { title: 'Python Dictionaries', url: 'https://www.w3schools.com/python/python_dictionaries.asp', description: 'Complete dictionary guide', icon: '🌐' },
      { title: 'JSON and Dictionaries', url: 'https://realpython.com/python-json/', description: 'Working with JSON data in Python', icon: '📖' },
    ]
  },
  'w3l5': {
    assignments: [
      { prompt: 'Extend the quiz game: add a timer concept (track how fast they answer), categories, and a high score system.', difficulty: 'hard', xp: 12,
        hint: 'Use dicts for questions, track score, show results at end.',
        validator: (code) => (code.match(/def /g) || []).length >= 2 && code.includes('for') ? { success: true, message: 'Advanced quiz game!' } : { success: false, message: 'Create at least 2 functions with loops.' } },
    ],
    quiz: [
      { question: 'What data structure is best for storing question-answer pairs?', options: ['List', 'Tuple', 'Dictionary', 'String'], correct: 2, explanation: 'Dictionaries map keys (questions) to values (answers) perfectly.' },
      { question: 'How do you loop through a dictionary?', options: ['for key in dict:', 'for i in range(dict):', 'while dict:', 'loop dict:'], correct: 0, explanation: 'for key in dict: iterates through all keys. Use .items() for key-value pairs.' },
      { question: 'What does random.choice(my_list) do?', options: ['Sorts the list', 'Picks a random element', 'Removes a random element', 'Shuffles the list'], correct: 1, explanation: 'random.choice() returns one random element from a sequence.' },
    ],
    resources: [
      { title: 'Building CLI Games', url: 'https://realpython.com/python-rock-paper-scissors/', description: 'Step-by-step game building tutorial', icon: '🎮' },
    ]
  },

  // ==================== WEEK 4 ====================
  'w4l1': {
    assignments: [
      { prompt: 'Build a dice rolling simulator that rolls 2 dice 1000 times and shows how often each total (2-12) appears.', difficulty: 'hard', xp: 12,
        hint: 'Use a dictionary to count each total. Loop 1000 times.',
        validator: (code) => code.includes('random') && code.includes('for') && code.includes('range') ? { success: true, message: 'Dice statistics calculated!' } : { success: false, message: 'Use random and a for loop with range.' } },
    ],
    quiz: [
      { question: 'What does random.randint(1, 6) simulate?', options: ['A coin flip', 'A dice roll', 'A random letter', 'A card draw'], correct: 1, explanation: 'randint(1, 6) returns a random integer from 1 to 6, just like a die.' },
      { question: 'How do you pick a random item from a list?', options: ['random.pick(list)', 'random.choice(list)', 'list.random()', 'random.select(list)'], correct: 1, explanation: 'random.choice() picks one random element from a sequence.' },
      { question: 'What does random.shuffle(my_list) do?', options: ['Returns a new shuffled list', 'Shuffles the list in place', 'Picks a random element', 'Sorts randomly'], correct: 1, explanation: 'shuffle() modifies the original list in place (does not return a new list).' },
    ],
    resources: [
      { title: 'Game Development with Python', url: 'https://inventwithpython.com/invent4thed/', description: 'Free book: Invent Your Own Computer Games', icon: '📖' },
    ]
  },
  'w4l2': {
    assignments: [
      { prompt: 'Create a text adventure with at least 5 rooms, items to collect, and a win condition.', difficulty: 'hard', xp: 12,
        hint: 'Use a dictionary for rooms: {"room1": {"desc": "...", "north": "room2"}}.',
        validator: (code) => code.includes('while') && code.includes('if') && code.includes('{') ? { success: true, message: 'Epic text adventure!' } : { success: false, message: 'Use while loop for game, if for choices, dict for rooms.' } },
    ],
    quiz: [
      { question: 'What is the game loop pattern?', options: ['A type of for loop', 'A while True loop that runs until the game ends', 'A loop that plays music', 'A countdown timer'], correct: 1, explanation: 'The game loop continuously gets input, updates state, and renders output until the game ends.' },
      { question: 'How do you convert user input to lowercase for comparison?', options: ['input().lower()', 'lower(input())', 'input().small()', 'input(lower)'], correct: 0, explanation: '.lower() converts a string to all lowercase letters.' },
    ],
    resources: [
      { title: 'Text Adventure Tutorial', url: 'https://letstalkdata.com/2014/08/how-to-write-a-text-adventure-in-python/', description: 'Step-by-step text adventure guide', icon: '🎮' },
    ]
  },
  'w4l3': {
    assignments: [
      { prompt: 'Create a full math quiz game with: addition, subtraction, multiplication, division. Track right/wrong answers and show percentage.', difficulty: 'medium', xp: 10,
        hint: 'Use random to generate problems, if to check answers, counter for score.',
        validator: (code) => code.includes('random') && code.includes('for') && code.includes('if') ? { success: true, message: 'Math quiz game done!' } : { success: false, message: 'Use random, loops, and conditionals.' } },
    ],
    quiz: [
      { question: 'How do you round a float to 2 decimal places?', options: ['round(num, 2)', 'num.round(2)', 'math.round(num, 2)', 'int(num, 2)'], correct: 0, explanation: 'round(number, digits) rounds to the specified decimal places.' },
      { question: 'What is abs(-5)?', options: ['-5', '5', '0', 'Error'], correct: 1, explanation: 'abs() returns the absolute (positive) value of a number.' },
      { question: 'How can you make a timed challenge in Python?', options: ['time.sleep()', 'import time and use time.time()', 'timer()', 'clock()'], correct: 1, explanation: 'Use time.time() to get timestamps before and after to measure elapsed time.' },
    ],
    resources: [
      { title: 'Python Math Module', url: 'https://www.w3schools.com/python/module_math.asp', description: 'Mathematical functions in Python', icon: '🌐' },
    ]
  },
  'w4l4': {
    assignments: [
      { prompt: 'Build a physics simulator: calculate trajectory of a projectile given angle and velocity. Show position at each second.', difficulty: 'hard', xp: 12,
        hint: 'Use math.sin, math.cos for components. Loop through time steps.',
        validator: (code) => code.includes('for') && code.includes('print') && (code.includes('math') || code.includes('*')) ? { success: true, message: 'Physics simulator built!' } : { success: false, message: 'Use loops and math to simulate motion.' } },
    ],
    quiz: [
      { question: 'What is a simulation in programming?', options: ['A video game', 'A model that imitates real-world processes', 'A type of database', 'An animation'], correct: 1, explanation: 'Simulations use code to model and predict real-world behavior.' },
      { question: 'How do you import the math module?', options: ['use math', 'include math', 'import math', '#include <math>'], correct: 2, explanation: 'import math makes all math functions available.' },
    ],
    resources: [
      { title: 'Physics with Python', url: 'https://www.geeksforgeeks.org/python-program-for-simple-interest/', description: 'Math and physics calculations', icon: '🔬' },
    ]
  },
  'w4l5': {
    assignments: [
      { prompt: 'Add special abilities, items, and a boss fight to your RPG. Include at least 3 character types.', difficulty: 'hard', xp: 15,
        hint: 'Use dicts for characters with special moves. Boss has more HP.',
        validator: (code) => (code.match(/def /g) || []).length >= 3 && code.includes('while') ? { success: true, message: 'Epic RPG with boss fight!' } : { success: false, message: 'Create 3+ functions and a battle while loop.' } },
    ],
    quiz: [
      { question: 'What is a good way to store character stats?', options: ['Multiple variables', 'A dictionary', 'A single string', 'Print statements'], correct: 1, explanation: 'Dictionaries let you organize related data: {"hp": 100, "attack": 15}' },
      { question: 'How do you make a game loop that runs until the player dies?', options: ['for i in range(hp):', 'while player_hp > 0:', 'if alive: loop', 'repeat until dead'], correct: 1, explanation: 'while player_hp > 0: keeps the game running as long as the player has health.' },
    ],
    resources: [
      { title: 'Making Games with Python', url: 'https://inventwithpython.com/pygame/', description: 'Free Pygame book for visual games', icon: '🎮' },
    ]
  },

  // ==================== WEEKS 5-8 (condensed but complete) ====================
  'w5l1': {
    assignments: [
      { prompt: 'Write a program that reads 5 numbers from input. Use try/except to handle non-numeric input gracefully.', difficulty: 'medium', xp: 8,
        validator: (code) => code.includes('try') && code.includes('except') && code.includes('for') ? { success: true, message: 'Error handling pro!' } : { success: false, message: 'Use try/except inside a loop.' } },
    ],
    quiz: [
      { question: 'What does try/except do?', options: ['Tries to run code, catches errors if they happen', 'Tests if code is correct', 'Tries to import a module', 'Creates a test case'], correct: 0 },
      { question: 'What error occurs when you divide by zero?', options: ['ValueError', 'TypeError', 'ZeroDivisionError', 'MathError'], correct: 2 },
      { question: 'When does the "finally" block run?', options: ['Only if no error', 'Only if error', 'Always, error or not', 'Never'], correct: 2 },
    ],
    resources: [
      { title: 'Python Exceptions', url: 'https://www.w3schools.com/python/python_try_except.asp', description: 'Try, except, finally explained', icon: '🌐' },
    ]
  },
  'w5l2': {
    assignments: [
      { prompt: 'Use list comprehension to: 1) Get squares of 1-20, 2) Filter words longer than 5 chars from a list, 3) Create a list of tuples (n, n**2) for 1-10.', difficulty: 'medium', xp: 10,
        validator: (code) => code.includes('[') && code.includes('for') && code.includes('if') ? { success: true, message: 'Comprehension master!' } : { success: false, message: 'Use list comprehensions with for and if.' } },
    ],
    quiz: [
      { question: 'What is [x*2 for x in range(5)] equivalent to?', options: ['[0,2,4,6,8]', '[2,4,6,8,10]', '[0,1,2,3,4]', '[1,2,3,4,5]'], correct: 0 },
      { question: 'Can list comprehensions have conditions?', options: ['No', 'Yes, using if at the end', 'Only with while', 'Only for strings'], correct: 1 },
    ],
    resources: [
      { title: 'List Comprehensions', url: 'https://realpython.com/list-comprehension-python/', description: 'Master Pythonic list creation', icon: '📖' },
    ]
  },
  'w5l3': {
    assignments: [
      { prompt: 'Create a student grade analyzer. Given a list of student dicts with subjects and scores, calculate per-student and per-subject averages.', difficulty: 'hard', xp: 12,
        validator: (code) => code.includes('for') && code.includes('{') && code.includes('/') ? { success: true, message: 'Grade analyzer built!' } : { success: false, message: 'Loop through data and calculate averages.' } },
    ],
    quiz: [
      { question: 'How do you access a value in a nested dictionary?', options: ['dict[key1, key2]', 'dict[key1][key2]', 'dict.key1.key2', 'dict(key1)(key2)'], correct: 1 },
      { question: 'What does sum([1,2,3,4,5]) return?', options: ['5', '12345', '15', '[15]'], correct: 2 },
    ],
    resources: [
      { title: 'Data Analysis with Python', url: 'https://www.w3schools.com/python/python_ml_getting_started.asp', description: 'Intro to data processing', icon: '📊' },
    ]
  },
  'w5l4': {
    assignments: [
      { prompt: 'Implement selection sort from scratch. Compare its performance with bubble sort on the same list.', difficulty: 'hard', xp: 12,
        validator: (code) => code.includes('def') && code.includes('for') && code.includes('min') ? { success: true, message: 'Selection sort implemented!' } : { success: false, message: 'Create a function with nested loops for sorting.' } },
    ],
    quiz: [
      { question: 'What does sorted() return?', options: ['Nothing, sorts in place', 'A new sorted list', 'The original list', 'True or False'], correct: 1 },
      { question: 'How do you sort a list in descending order?', options: ['sort(reverse)', 'sorted(list, reverse=True)', 'list.sort(down=True)', 'reverse(sort(list))'], correct: 1 },
    ],
    resources: [
      { title: 'Sorting Algorithms Visualized', url: 'https://visualgo.net/en/sorting', description: 'Watch sorting algorithms step by step', icon: '📈' },
    ]
  },
  'w5l5': {
    assignments: [
      { prompt: 'Add GPA calculation, honor roll detection, and a report card printer to your grade tracker.', difficulty: 'hard', xp: 15,
        validator: (code) => (code.match(/def /g) || []).length >= 3 ? { success: true, message: 'Full grade tracker!' } : { success: false, message: 'Create at least 3 functions.' } },
    ],
    quiz: [
      { question: 'What is a good way to map letter grades to GPA points?', options: ['If/elif chain', 'A dictionary', 'A list', 'Math formula'], correct: 1 },
      { question: 'How do you format a float to 2 decimal places in an f-string?', options: ['f"{val:2}"', 'f"{val:.2f}"', 'f"{val,2}"', 'f"{round(val)}"'], correct: 1 },
    ],
    resources: [
      { title: 'Python File I/O', url: 'https://www.w3schools.com/python/python_file_handling.asp', description: 'Reading and writing files', icon: '🌐' },
    ]
  },
  'w6l1': {
    assignments: [
      { prompt: 'Create a BankAccount class with deposit(), withdraw(), and get_balance(). Prevent negative withdrawals.', difficulty: 'medium', xp: 10,
        validator: (code) => code.includes('class') && code.includes('self') && (code.match(/def /g) || []).length >= 3 ? { success: true, message: 'BankAccount class done!' } : { success: false, message: 'Create a class with at least 3 methods.' } },
    ],
    quiz: [
      { question: 'What is __init__ in a class?', options: ['A regular method', 'The constructor - runs when creating an object', 'A private variable', 'An import statement'], correct: 1 },
      { question: 'What does "self" refer to?', options: ['The class itself', 'The current instance of the class', 'The Python interpreter', 'The parent class'], correct: 1 },
      { question: 'How do you create an object from a class?', options: ['obj = new MyClass()', 'obj = MyClass()', 'obj = create MyClass', 'MyClass obj = new()'], correct: 1 },
    ],
    resources: [
      { title: 'Python Classes', url: 'https://www.w3schools.com/python/python_classes.asp', description: 'Object-oriented programming in Python', icon: '🌐' },
      { title: 'OOP Concepts', url: 'https://realpython.com/python3-object-oriented-programming/', description: 'Deep dive into OOP principles', icon: '📖' },
    ]
  },
  'w6l2': {
    assignments: [
      { prompt: 'Create a Shape base class with area(). Create Circle, Rectangle, Triangle subclasses that override area().', difficulty: 'medium', xp: 10,
        validator: (code) => (code.match(/class /g) || []).length >= 3 && code.includes('def area') ? { success: true, message: 'Shape hierarchy built!' } : { success: false, message: 'Create 3+ classes with area() methods.' } },
    ],
    quiz: [
      { question: 'What is inheritance?', options: ['Copying code', 'A child class getting properties from a parent class', 'Importing modules', 'Creating variables'], correct: 1 },
      { question: 'How do you create a child class?', options: ['class Child extends Parent:', 'class Child(Parent):', 'class Child inherits Parent:', 'class Child < Parent:'], correct: 1 },
      { question: 'What does super().__init__() do?', options: ['Creates a super variable', 'Calls the parent class constructor', 'Deletes the parent', 'Makes the class faster'], correct: 1 },
    ],
    resources: [
      { title: 'Inheritance in Python', url: 'https://realpython.com/inheritance-composition-python/', description: 'Inheritance vs composition patterns', icon: '📖' },
    ]
  },
  'w6l3': {
    assignments: [
      { prompt: 'Create an RPG with: Character base class, Warrior (high HP), Mage (high attack), Healer (can heal). Simulate a 3v3 battle.', difficulty: 'hard', xp: 15,
        validator: (code) => (code.match(/class /g) || []).length >= 3 && code.includes('while') ? { success: true, message: 'Epic RPG battle system!' } : { success: false, message: 'Create 3+ character classes and a battle loop.' } },
    ],
    quiz: [
      { question: 'Why use classes for game characters instead of dictionaries?', options: ['Classes are faster', 'Classes bundle data AND behavior together', 'Dictionaries cannot store numbers', 'There is no difference'], correct: 1 },
      { question: 'What is method overriding?', options: ['Deleting a method', 'A child class providing its own version of a parent method', 'Calling a method twice', 'Making a method private'], correct: 1 },
    ],
    resources: [
      { title: 'Game Design Patterns', url: 'https://gameprogrammingpatterns.com/', description: 'Professional game programming patterns', icon: '🎮' },
    ]
  },
  'w6l4': {
    assignments: [
      { prompt: 'Build a shop system with: Item class, Shop class (buy/sell), and Player inventory. Items have name, price, type, and rarity.', difficulty: 'hard', xp: 12,
        validator: (code) => (code.match(/class /g) || []).length >= 2 && (code.match(/def /g) || []).length >= 5 ? { success: true, message: 'Shop system complete!' } : { success: false, message: 'Create 2+ classes with 5+ methods total.' } },
    ],
    quiz: [
      { question: 'What is encapsulation?', options: ['Hiding data inside a class', 'Making code run faster', 'Writing comments', 'Using global variables'], correct: 0 },
      { question: 'How do you check the type of an object?', options: ['type(obj)', 'obj.type()', 'typeof(obj)', 'class(obj)'], correct: 0 },
    ],
    resources: [
      { title: 'Python Data Classes', url: 'https://realpython.com/python-data-classes/', description: 'Modern Python class shortcuts', icon: '📖' },
    ]
  },
  'w6l5': {
    assignments: [
      { prompt: 'Extend the pet simulator: add pet types (Dog, Cat, Fish), evolution system, mini-games, and a day/night cycle.', difficulty: 'hard', xp: 15,
        validator: (code) => (code.match(/class /g) || []).length >= 2 && (code.match(/def /g) || []).length >= 5 ? { success: true, message: 'Advanced pet simulator!' } : { success: false, message: 'Create 2+ classes with 5+ methods.' } },
    ],
    quiz: [
      { question: 'What OOP principle lets Dog and Cat share Animal behaviors?', options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'], correct: 1 },
      { question: 'What is polymorphism?', options: ['Many classes', 'Same method name behaving differently in different classes', 'A type of variable', 'Multiple inheritance'], correct: 1 },
    ],
    resources: [
      { title: 'Design Patterns in Python', url: 'https://refactoring.guru/design-patterns/python', description: 'Common software design patterns', icon: '📖' },
    ]
  },
  'w7l1': {
    assignments: [
      { prompt: 'Implement both linear and binary search. Compare how many steps each takes to find the same element in a sorted list of 100 items.', difficulty: 'hard', xp: 12,
        validator: (code) => (code.match(/def /g) || []).length >= 2 && code.includes('while') ? { success: true, message: 'Search comparison done!' } : { success: false, message: 'Implement 2 search functions.' } },
    ],
    quiz: [
      { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], correct: 1, explanation: 'Binary search halves the search space each step = O(log n).' },
      { question: 'Binary search requires the list to be:', options: ['Empty', 'Sorted', 'Short', 'Contain only numbers'], correct: 1 },
      { question: 'In a list of 1000 items, how many steps does binary search need at most?', options: ['1000', '500', '10', '100'], correct: 2, explanation: 'log2(1000) is about 10.' },
    ],
    resources: [
      { title: 'Searching Algorithms', url: 'https://visualgo.net/en/sorting', description: 'Visualize search algorithms', icon: '📈' },
      { title: 'Big O Notation', url: 'https://www.freecodecamp.org/news/big-o-notation-why-it-matters-and-why-it-doesnt-1674cfa8a23c/', description: 'Understanding algorithm efficiency', icon: '📖' },
    ]
  },
  'w7l2': {
    assignments: [
      { prompt: 'Implement insertion sort and compare it with bubble sort. Count swaps for both on the same random list.', difficulty: 'hard', xp: 12,
        validator: (code) => (code.match(/def /g) || []).length >= 2 && code.includes('for') ? { success: true, message: 'Sorting algorithms compared!' } : { success: false, message: 'Implement 2 sorting functions.' } },
    ],
    quiz: [
      { question: 'What is the basic idea of bubble sort?', options: ['Pick the smallest each time', 'Compare adjacent elements and swap', 'Divide the list in half', 'Insert each element in order'], correct: 1 },
      { question: 'What is the time complexity of bubble sort?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(n log n)'], correct: 2 },
    ],
    resources: [
      { title: 'Sorting Algorithms Animated', url: 'https://www.toptal.com/developers/sorting-algorithms', description: 'Compare sorting algorithms visually', icon: '📈' },
    ]
  },
  'w7l3': {
    assignments: [
      { prompt: 'Write recursive functions for: 1) Fibonacci, 2) Sum of digits, 3) Reverse a string. No loops allowed!', difficulty: 'hard', xp: 12,
        validator: (code) => (code.match(/def /g) || []).length >= 3 && !code.includes('while') && !code.includes('for') ? { success: true, message: 'Pure recursion master!' } : { success: false, message: 'Write 3 recursive functions without any loops.' } },
    ],
    quiz: [
      { question: 'What are the two parts of every recursive function?', options: ['Input and output', 'Base case and recursive case', 'Start and end', 'Try and except'], correct: 1 },
      { question: 'What happens without a base case?', options: ['Nothing', 'Infinite recursion (stack overflow)', 'It returns 0', 'The function is skipped'], correct: 1 },
      { question: 'What is factorial(0)?', options: ['0', '1', 'undefined', 'error'], correct: 1, explanation: 'By definition, 0! = 1. This is typically the base case.' },
    ],
    resources: [
      { title: 'Recursion Explained', url: 'https://realpython.com/python-recursion/', description: 'Visual guide to recursive thinking', icon: '📖' },
    ]
  },
  'w7l4': {
    assignments: [
      { prompt: 'Create these patterns: 1) Hollow square, 2) Diamond, 3) Number pyramid. Each at least 7 rows.', difficulty: 'medium', xp: 10,
        validator: (code) => (code.match(/for /g) || []).length >= 3 && code.includes('print') ? { success: true, message: 'Pattern artist!' } : { success: false, message: 'Use nested for loops with print().' } },
    ],
    quiz: [
      { question: 'What does " " * n do in a pattern?', options: ['Creates n spaces', 'Multiplies space by n', 'Error', 'Prints nothing'], correct: 0 },
      { question: 'How do nested loops help create 2D patterns?', options: ['Outer loop = rows, inner loop = columns', 'They run faster', 'They create variables', 'They sort data'], correct: 0 },
    ],
    resources: [
      { title: 'Python Pattern Programs', url: 'https://www.geeksforgeeks.org/programs-printing-pyramid-patterns-python/', description: '50+ pattern examples', icon: '🌐' },
    ]
  },
  'w7l5': {
    assignments: [
      { prompt: 'Build a sorting visualizer that shows bubble sort and selection sort step-by-step with ASCII bar charts.', difficulty: 'hard', xp: 15,
        validator: (code) => code.includes('def') && code.includes('for') && code.includes('print') ? { success: true, message: 'Algorithm visualizer complete!' } : { success: false, message: 'Create visualization functions.' } },
    ],
    quiz: [
      { question: 'Why is visualizing algorithms useful?', options: ['It makes code faster', 'It helps understand how algorithms work step by step', 'It is required by Python', 'It reduces bugs'], correct: 1 },
      { question: 'Which sorting algorithm is generally fastest for large datasets?', options: ['Bubble sort', 'Selection sort', 'Merge sort / Quick sort', 'Insertion sort'], correct: 2 },
    ],
    resources: [
      { title: 'Algorithm Visualizer', url: 'https://algorithm-visualizer.org/', description: 'Interactive algorithm visualization tool', icon: '📈' },
    ]
  },
  'w8l1': {
    assignments: [
      { prompt: 'Build a chatbot that can: greet, answer questions about Python, tell jokes, and remember the users name during the conversation.', difficulty: 'medium', xp: 10,
        validator: (code) => code.includes('def') && code.includes('while') && (code.match(/if|elif/g) || []).length >= 5 ? { success: true, message: 'Smart chatbot!' } : { success: false, message: 'Create a chatbot with 5+ response patterns.' } },
    ],
    quiz: [
      { question: 'What is the simplest form of AI?', options: ['Neural networks', 'Rule-based / keyword matching', 'Quantum computing', 'Blockchain'], correct: 1 },
      { question: 'How do most chatbots understand user input?', options: ['They read minds', 'Pattern matching on keywords', 'They ask other AI', 'Random responses'], correct: 1 },
      { question: 'What is NLP?', options: ['New Language Python', 'Natural Language Processing', 'Network Logic Protocol', 'Nested Loop Pattern'], correct: 1, explanation: 'NLP is how computers understand and process human language.' },
    ],
    resources: [
      { title: 'AI for Beginners', url: 'https://microsoft.github.io/AI-For-Beginners/', description: 'Free AI curriculum by Microsoft', icon: '🤖' },
      { title: 'What is Machine Learning?', url: 'https://www.ibm.com/topics/machine-learning', description: 'IBM explainer on ML basics', icon: '📖' },
    ]
  },
  'w8l2': {
    assignments: [
      { prompt: 'Build a movie review sentiment analyzer. Classify reviews as positive/negative based on word lists. Test with 10 sample reviews.', difficulty: 'hard', xp: 12,
        validator: (code) => code.includes('def') && code.includes('for') && code.includes('[') ? { success: true, message: 'Sentiment analyzer works!' } : { success: false, message: 'Create a classifier function.' } },
    ],
    quiz: [
      { question: 'What is classification in AI?', options: ['Sorting files', 'Categorizing data into predefined groups', 'Counting items', 'Creating new data'], correct: 1 },
      { question: 'What is a training dataset?', options: ['Data used to test the model', 'Data used to teach the model patterns', 'The final output', 'A type of database'], correct: 1 },
    ],
    resources: [
      { title: 'Sentiment Analysis Tutorial', url: 'https://realpython.com/sentiment-analysis-python/', description: 'Build a sentiment analyzer step by step', icon: '📖' },
    ]
  },
  'w8l3': {
    assignments: [
      { prompt: 'Create a Tic-Tac-Toe game using a 3x3 matrix. Include a simple AI opponent that plays randomly.', difficulty: 'hard', xp: 12,
        validator: (code) => code.includes('for') && code.includes('[') && code.includes('def') ? { success: true, message: 'Tic-Tac-Toe with AI!' } : { success: false, message: 'Use 2D list and functions.' } },
    ],
    quiz: [
      { question: 'How do you access element at row 1, column 2 in a 2D list?', options: ['grid[1,2]', 'grid[1][2]', 'grid(1,2)', 'grid.get(1,2)'], correct: 1 },
      { question: 'What is a 2D list used for in AI?', options: ['Only for games', 'Representing matrices and image data', 'Storing passwords', 'Nothing related to AI'], correct: 1 },
    ],
    resources: [
      { title: 'NumPy for Beginners', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', description: 'NumPy: the foundation of data science', icon: '📘' },
    ]
  },
  'w8l4': {
    assignments: [
      { prompt: 'Build a book/music recommender. Create 8+ user profiles with interests. Recommend based on similarity scores between users.', difficulty: 'hard', xp: 12,
        validator: (code) => code.includes('def') && code.includes('for') && code.includes('{') ? { success: true, message: 'Recommendation engine built!' } : { success: false, message: 'Create recommendation function with user data.' } },
    ],
    quiz: [
      { question: 'What is collaborative filtering?', options: ['Filtering spam', 'Recommending based on similar users preferences', 'Sorting data', 'Compressing files'], correct: 1 },
      { question: 'Why do recommendation engines need lots of data?', options: ['To be slow', 'More data = better pattern detection = better recommendations', 'Data is free', 'They dont'], correct: 1 },
    ],
    resources: [
      { title: 'How Netflix Recommendations Work', url: 'https://help.netflix.com/en/node/100639', description: 'Real-world recommendation system', icon: '🎬' },
    ]
  },
  'w8l5': {
    assignments: [
      { prompt: 'Build your ultimate capstone project combining classes, functions, data structures, and at least one AI feature. Document it with comments.', difficulty: 'hard', xp: 20,
        validator: (code) => { const d = (code.match(/def /g)||[]).length; const c = (code.match(/class /g)||[]).length; const comments = (code.match(/#/g)||[]).length; return d >= 3 && (c >= 1 || d >= 5) && comments >= 5 ? { success: true, message: 'LEGENDARY capstone!' } : { success: false, message: 'Need 3+ functions, 1+ class (or 5+ functions), and 5+ comments.' }; } },
    ],
    quiz: [
      { question: 'What makes a good software project?', options: ['Lots of code', 'Clean code, good structure, and documentation', 'No comments', 'Only one file'], correct: 1 },
      { question: 'What should you do before writing code for a big project?', options: ['Just start coding', 'Plan the structure, classes, and functions first', 'Copy from the internet', 'Write tests first'], correct: 1 },
      { question: 'What is the most important skill in programming?', options: ['Memorizing syntax', 'Problem-solving and logical thinking', 'Typing fast', 'Knowing every language'], correct: 1, explanation: 'Languages change, but problem-solving is forever!' },
    ],
    resources: [
      { title: 'Python Project Ideas', url: 'https://realpython.com/intermediate-python-project-ideas/', description: 'Inspiring project ideas to keep building', icon: '🚀' },
      { title: 'Learn Python - Full Course (YouTube)', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', description: 'Free 4-hour Python course by freeCodeCamp', icon: '🎥' },
      { title: 'Codecademy Python', url: 'https://www.codecademy.com/learn/learn-python-3', description: 'Interactive Python course', icon: '🌐' },
    ]
  },
};

// ==================== MERGE EXTRAS INTO WEEKS ====================
(function mergeExtras() {
  for (const week of WEEKS) {
    for (const lesson of week.lessons) {
      const extras = LESSON_EXTRAS[lesson.id];
      if (extras) {
        if (extras.assignments) lesson.assignments = extras.assignments;
        if (extras.quiz) lesson.quiz = extras.quiz;
        if (extras.resources) lesson.resources = extras.resources;
      }
    }
  }
})();
