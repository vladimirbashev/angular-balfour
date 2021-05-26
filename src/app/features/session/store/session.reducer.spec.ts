// import cloneDeep from 'lodash/cloneDeep';
// import merge from 'lodash/merge';

// import * as fromSessionActions from './session.actions';
// import { sessionReducer, sessionInitialState } from './session.reducer';
// import { SessionState } from './session.state';
// import { Session, User } from '../models/index';
// import { EntityState } from '../../../common/models/index';
// import { users, utils } from '../../../../mock/src/public_api';

// describe('[Session] store/reducer', () => {

//     let session: Session;
//     let state: SessionState;
//     let user: User;

//     beforeEach(() => {
//         state = cloneDeep(sessionInitialState);
//         user = users[0];
//         session = utils.sessions.create(user);
//     });

//     it('should have initial state', () => {
//         expect(sessionReducer(undefined, { type: null })).toEqual(sessionInitialState);
//         expect(sessionReducer(sessionInitialState, { type: null })).toEqual(sessionInitialState);
//     });

//     it('should reduce session signin states', () => {
//         expect(sessionReducer(sessionInitialState,
//             new fromSessionActions.SessionSigninInitAction(user.login, user.password)))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Progress, error: null }));
//         expect(sessionReducer(merge(cloneDeep(state), { error: 'error' }),
//             new fromSessionActions.SessionSigninAbortAction()))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Error, error: 'error' }));
//         expect(sessionReducer(merge(cloneDeep(state), { session: session }),
//             new fromSessionActions.SessionSigninAbortAction()))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Data, session: session }));
//         expect(sessionReducer(state,
//             new fromSessionActions.SessionSigninAbortAction()))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Empty }));
//         expect(sessionReducer(merge(cloneDeep(state), { error: 'error' }),
//             new fromSessionActions.SessionSigninSuccessAction(session)))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Data, session: session, error: null }));
//         expect(sessionReducer(state,
//             new fromSessionActions.SessionSigninFailureAction('error')))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Error, error: 'error' }));
//     });

//     it('should reduce session signout states', () => {
//         expect(sessionReducer(sessionInitialState,
//             new fromSessionActions.SessionSignoutInitAction()))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Progress }));
//         expect(sessionReducer(merge(cloneDeep(state), { error: 'error' }),
//             new fromSessionActions.SessionSignoutAbortAction()))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Error, error: 'error' }));
//         expect(sessionReducer(merge(cloneDeep(state), { session: session }),
//             new fromSessionActions.SessionSignoutAbortAction()))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Data, session: session }));
//         expect(sessionReducer(state,
//             new fromSessionActions.SessionSignoutAbortAction()))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Empty }));
//         expect(sessionReducer(merge(cloneDeep(state), { error: 'error' }),
//             new fromSessionActions.SessionSignoutSuccessAction()))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Empty, session: null, error: null }));
//         expect(sessionReducer(state,
//             new fromSessionActions.SessionSignoutFailureAction('error')))
//             .toEqual(merge(cloneDeep(state), { state: EntityState.Error, error: 'error' }));
//     });

//     it('should reduce session restore states', () => {
//         expect(sessionReducer(sessionInitialState,
//             new fromSessionActions.SessionRestoreInitAction({ session_id: session.id, user_id: session.user_id })))
//             .toEqual(merge(cloneDeep(state), {
//                 session: {
//                     id: session.id,
//                     user_id: session.user_id
//                 }, error: null, state: EntityState.Progress
//             }));
//         expect(sessionReducer(sessionInitialState,
//             new fromSessionActions.SessionRestoreSuccessAction({ session })))
//             .toEqual(merge(cloneDeep(state), { session: session, error: null, state: EntityState.Data }));
//         expect(sessionReducer(sessionInitialState,
//             new fromSessionActions.SessionRestoreFailureAction({ error: 'error' })))
//             .toEqual(merge(cloneDeep(state), { error: 'error', state: EntityState.Error }));
//     });

//     it('should reduce session close all states', () => {
//         const joc = jasmine.objectContaining;
//         expect(sessionReducer(state,
//             new fromSessionActions.SessionCloseAllInitAction()))
//             .toEqual(joc({ state: EntityState.Progress, error: null }));
//         expect(sessionReducer(state,
//             new fromSessionActions.SessionCloseAllSuccessAction()))
//             .toEqual(joc({ session: null, state: EntityState.Empty, error: null }));
//         expect(sessionReducer(state,
//             new fromSessionActions.SessionCloseAllFailureAction('error')))
//             .toEqual(joc({ state: EntityState.Error, error: 'error' }));
//     });

// });
