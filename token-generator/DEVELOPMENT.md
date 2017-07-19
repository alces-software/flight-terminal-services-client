# Developing the launch token generator

The launch token generator consists of a few parts:

 1. A `flight-launch-token-generator.html.erb` file comprising the HTML form.
 2. A `flight-launch-token-generator.js` file comprising the JavaScript.
 3. A number of `*.txt` files containing word lists and token generation
    rules.
 4. A Makefile.


## Changing the token generation rules

The token generation rules are encoded in a set of `*.txt` files.  The
`combinations.txt` file encodes which combinations of parts of speech are
permitted, each line being one permitted combination.  For example, the rule
`adjective animal animal` allows for tokens such as `big-dog-bear`.

For each part of speech in `combinations.txt` there is a corresponding
`${part-of-speech}.txt` file, e.g., `adjectives.txt`.  These files list all of
the possible entries permitted for that part of speech, one entry per-line.
For example, the first few entries in `adjectives.txt` are `able`, `abundant`,
`adorable`.

Each time a token is generated, a randomly selected combination is chosen from
`combinations.txt`.  Then for each part of speech in the combination a
randomly selected entry from the corresponding `.txt` file is selected.
Finally, the selected words are combined with `-`s.

With the above understood, it should be straightforward to understand how to
add or remove combinations, or how to add or remove entries for a particular
part of speech; simply add or remove lines from the appropriate file.

### Adding new word lists

Adding a new list of words is slightly more complicated.  There are three
steps:

 1. Write the list of words
 2. Edit `combinations.txt` to include some entries making use of the new
    list.
 3. Edit `flight-launch-token-generator.html.erb` to load the new list of
    words.

## Deploying changes to the token generator

Changes to the token generator are deployed by deploying a new release of
Flight Launch.  The final HTML and JavaScript files are generated as part of
the build process.
