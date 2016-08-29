INSERT INTO
  users (email, encrypted_password)
VALUES
  ('bob@bob.com', '');

INSERT INTO
  personal_tasks (user_id, task, sub_task, due_date, is_important, is_work)
VALUES
  (1, 'eat a pidgoen', 'flying rats', '1/1/2017', false, false),
  (1, 'eat a duck', 'cute food', '1/1/2017', false, false),
  (1, 'eat a cow', 'the standard', '1/1/2017', false, false)
  ;
