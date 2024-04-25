INSERT INTO role (name) VALUES ('Admin');
INSERT INTO role (name) VALUES ('User');

INSERT INTO user (username, firstname, lastname, password, roleId, email)
VALUES ('johndoe', 'John', 'Doe', 'password123', 1, 'john.doe@example.com');

INSERT INTO user (username, firstname, lastname, password, roleId, email)
VALUES ('janedoe', 'Jane', 'Doe', 'password321', 2, 'jane.doe@example.com');
