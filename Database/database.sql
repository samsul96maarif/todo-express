CREATE TABLE users(
                         id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                         email VARCHAR(125),
                         password VARCHAR(255),
    created_at  timestamp default CURRENT_TIMESTAMP null,
    updated_at  timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at timestamp null
);

CREATE TABLE checklists(
                           id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                         object_id BIGINT UNSIGNED,
                         object_domain VARCHAR(125),
                         description VARCHAR(125),
                         is_completed enum('1', '0') default '0',
                         completed_at timestamp null,
                         last_updated_by varchar(100) default null,
                         due timestamp null,
                         urgency INT(2) UNSIGNED default 1,
    created_at  timestamp default CURRENT_TIMESTAMP null,
    updated_at  timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE items(
                           id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                           description VARCHAR(125),
                           is_completed enum('1', '0') default '0',
                           completed_at timestamp null,
                           due timestamp null,
                           urgency INT(2) UNSIGNED default 1,
                           assignee_id VARCHAR (100) null ,
                           task_id  bigint unsigned null,
                           checklist_id  bigint unsigned null,
                           created_at  timestamp default CURRENT_TIMESTAMP null,
                           updated_at  timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           foreign key (checklist_id) references checklists (id)
                               on delete cascade
);