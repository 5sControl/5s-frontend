import { Fragment } from 'react';

export const UserList = ({ userList }) => {
  console.log(userList);
  return (
    <div className="company__accounts_container">
      {userList.map((user) => (
        <Fragment key={user.id}>
          <div className="company__user">
            <span>{user.username}</span>
            {user.id === 1 ? (
              <div className="company__user_owner">Owner</div>
            ) : (
              <div
                className={
                  user.user_type === 'Worker' ? 'company__user_worker' : 'company__user_staff'
                }
              >
                {user.user_type}
              </div>
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
