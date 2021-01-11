
DROP table if exists teacher_student;
DROP table if exists teacher;
DROP table if exists student;
CREATE TABLE teacher (
id int(10) not null AUTO_INCREMENT,
email varchar(255) not null,
PRIMARY KEY (`id`),
UNIQUE KEY `email_unique` (`email`)
);

CREATE TABLE student (
id int(10) not null AUTO_INCREMENT,
email varchar(255) not null,
suspended bool not null default false,
PRIMARY KEY (`id`),
UNIQUE KEY `email_unique` (`email`)
);

CREATE TABLE teacher_student (
`id` int(10) not null AUTO_INCREMENT,
`fk_teacher` int(10)  not null,
`fk_student` int(10)  not null,
PRIMARY KEY (`id`),
FOREIGN KEY (`fk_teacher`) REFERENCES `teacher`(`id`) ON DELETE NO ACTION,
FOREIGN KEY (`fk_student`) REFERENCES `student`(`id`) ON DELETE NO ACTION,
UNIQUE KEY `teacher_student_unique` (`fk_teacher`,`fk_student`)
);
