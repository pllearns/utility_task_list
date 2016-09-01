INSERT INTO
  users (email, encrypted_password)
VALUES
  ('bob@bob.com', '$2a$06$IXZlu18nkWvuCY8aRLixLu6msCgx1q2kWxuiUY7fCTMAceEflcXwe');

INSERT INTO
  tasks (user_id, rank, task, sub_task, due_date, is_important, is_work, is_complete)
VALUES
  (1, 0, 'eat a pidgoen', 'flying rats', '1/1/2017', false, false, false),
  (1, 1, 'eat a duck', 'cute food', '1/1/2017', false, false, false),
  (1, 2, 'eat a cow', 'the standard', '1/1/2017', false, false, false),
  (1, 3, 'eat a pug', 'tasty', '1/1/2017', false, false, false),
  (1, 4, 'eat a hawk', 'the standard', '1/1/2017', false, false, false)
  ;
