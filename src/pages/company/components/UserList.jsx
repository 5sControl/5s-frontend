import { Fragment } from 'react';

export const UserList = ({ userList }) => {
  return (
    <div className="company__accounts_container">
      {userList.map((user) => (
        <Fragment key={user.id}>
          <div className="company__user">
            <span>{user.username}</span>
            {/* {user.id === 1 ? (
              <div className="company__user_owner">Owner</div>
            ) : ( */}
              <div
                className={
                  user.role === 'superuser' 
                  ? 'company__user_superuser' 
                  : user.role === 'admin' ?
                  'company__user_admin' : 'company__user_worker'
                }
              >
                {user.role}
              </div>
            {/* )} */}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
