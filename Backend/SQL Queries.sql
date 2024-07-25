CREATE TABLE student (
    student_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(100) NOT NULL
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    answer_index INTEGER NOT NULL
);

INSERT INTO questions (question, options, answer_index) VALUES
('What is the time complexity of binary search?', ARRAY['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], 1),
('Which data structure allows you to search in O(1) time complexity on average?', ARRAY['Array', 'Linked List', 'Hash Table', 'Binary Tree'], 2),
('Which sorting algorithm has the worst-case time complexity of O(n^2)?', ARRAY['Merge Sort', 'Quick Sort', 'Bubble Sort', 'Insertion Sort'], 2),
('What is the worst-case time complexity of Quick Sort?', ARRAY['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], 2),
('Which data structure uses LIFO (Last In, First Out) order?', ARRAY['Queue', 'Stack', 'Heap', 'Binary Search Tree'], 1),
('What is the primary purpose of Breadth-First Search (BFS) algorithm?', ARRAY['Finding shortest path in a weighted graph', 'Traversing a binary tree', 'Sorting elements in an array', 'Finding connected components in a graph'], 0),
('Which of the following is not a type of tree traversal?', ARRAY['Inorder', 'Postorder', 'Depth-First', 'Preorder'], 2),
('Which algorithm is used for finding Minimum Spanning Tree (MST) in a graph?', ARRAY['Dijkstra''s Algorithm', 'Bellman-Ford Algorithm', 'Prim''s Algorithm', 'Kruskal''s Algorithm'], 2),
('Which of the following is an example of a Greedy algorithm?', ARRAY['Merge Sort', 'Knapsack Problem', 'Breadth-First Search (BFS)', 'Depth-First Search (DFS)'], 1),
('What is the time complexity of Heap Sort?', ARRAY['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], 0);

SELECT * FROM questions;

CREATE TABLE student_answers (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES student(student_id),
    question_id INTEGER NOT NULL REFERENCES questions(id),
    student_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL
);
