CREATE TABLE studenttudents (
    student_id VARCHAR(10) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(100) NOT NULL
);

CREATE TABLE Questions (
    question_id SERIAL PRIMARY KEY,
    correct_answer VARCHAR(100) NOT NULL
);

CREATE TABLE Tests (
    test_id SERIAL PRIMARY KEY,
    test_name VARCHAR(100) NOT NULL
);

CREATE TABLE StudentAnswers (
    answer_id SERIAL PRIMARY KEY,
    student_id VARCHAR NOT NULL,
    test_id INT NOT NULL,
    question_id INT NOT NULL,
    student_answer VARCHAR(100) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (test_id) REFERENCES Tests(test_id),
    FOREIGN KEY (question_id) REFERENCES Questions(question_id)
);

CREATE TABLE TestResults (
    result_id SERIAL PRIMARY KEY,
    student_id VARCHAR NOT NULL,
    test_id INT NOT NULL,
    question_id INT NOT NULL,
    student_answer VARCHAR(100) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (test_id) REFERENCES Tests(test_id),
    FOREIGN KEY (question_id) REFERENCES Questions(question_id)
);


