INSERT INTO
  users (email, encrypted_password)
VALUES
  ('bob@bob.com', '$2a$06$IXZlu18nkWvuCY8aRLixLu6msCgx1q2kWxuiUY7fCTMAceEflcXwe');

INSERT INTO
  tasks (user_id, task, sub_task, due_date, is_important, is_work)
VALUES
  (1, 'eat a pidgoen', 'flying rats', '1/1/2017', false, false),
  (1, 'eat a duck', 'cute food', '1/1/2017', false, false),
  (1, 'eat a cow', 'the standard', '1/1/2017', false, false)
  ;
