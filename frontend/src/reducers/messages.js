export const messagesInitialState = []

export const Messages_action_types = {
    ADD : 'ADD',
    EDIT : 'EDIT',
    DELETE : 'DELETE',
    LOAD: 'LOAD'
}

const UPDATE_STATE_BY_ACTION ={
    [Messages_action_types.LOAD] : (_, action)=>{
        return action.payload
    },
    [Messages_action_types.ADD] : (state, action)=>{
        return [...state, action.payload];
    },
    [Messages_action_types.DELETE] : (state, action) =>{
        const {id} = action.payload
        const result = state.filter(message=> message.id !== id)
        return result;
    },
    [Messages_action_types.EDIT] :(state, action)=>{
        const {id, messages} = action.payload
        const result = state.map(msg =>msg.id === id ? {...msg, message : messages} : msg)
        return result;
    }
}

export const messagesReducer = (state, action)=>{
    const {type: actionType} = action;
    const updateState = UPDATE_STATE_BY_ACTION[actionType]
    return updateState ? updateState(state, action) : state;
}