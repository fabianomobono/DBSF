
//logout logic
document.querySelector(".logout_a").addEventListener('click', (e) =>{

  e.preventDefault()
  document.querySelector('.logout_form').submit()
})


//displays all pending friend requests
const f_requests = new XMLHttpRequest()
f_requests.open('GET', '/get_f_requests', true)
f_requests.onload = () => {
  const requests = JSON.parse(f_requests.responseText)

  class Friendship_requests_div extends React.Component {
    constructor(props){
      super(props);
      this.state = {
       pending: requests.requests
      }
    }

    confirm_request(id) {
      const confirm = new XMLHttpRequest()
      const csrftoken = Cookies.get('csrftoken');
      
      confirm.open('POST', '/confirm_friend_request', true);
      confirm.setRequestHeader('X-CSRFToken', csrftoken);
      confirm.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      confirm.onload = () => {
        const response = JSON.parse(confirm.responseText)
        console.log(response)
        if (response.response === 'friendship confirmed'){
          const box = document.getElementById(id)
          const message = document.createElement("P");
          message.setAttribute("class", "no_results_p");
          message.innerHTML = response.response
          box.innerHTML = ''
          box.appendChild(message)
          console.log(message)
        }
       
      }
      confirm.send(id)
    }

    ignore_request(id) {
      const ignore = new XMLHttpRequest();
      const csrftoken = Cookies.get('csrftoken');
      ignore.open('POST', '/ignore_friend_request', true);
      ignore.setRequestHeader('X-CSRFToken',csrftoken);
      ignore.setRequestHeader('Content-Type', "text/plain;charset=UTF-8");
      ignore.onload = () => {
        const response = JSON.parse(ignore.responseText)
        if (response.response === 'request ignored'){
          const box = document.getElementById(id)
          const message = document.createElement("P");
          message.setAttribute("class", "no_results_p");
          message.innerHTML = response.response
          box.innerHTML = ''
          box.appendChild(message)
          console.log(message)
        }
      }
      ignore.send(id)
    }
    render() {
      return (
        <div>
          {this.state.pending.length ? this.state.pending.map(x => <Friendship_request
            key={x.id}
            img={x.sender_profile_pic}
            sender={x.sender}
            id={x.id}
            ignore={() => this.ignore_request(x.id)}
            confirm={() => this.confirm_request(x.id)}
            />
          ): <p className='no_results_p'>No pending Friendship requests.</p>}
        </div>
      );
    }
  }


  ReactDOM.render(
    <Friendship_requests_div />, 
    document.getElementById("friendship_request_div")
  )
}
f_requests.send()


// load the feed
const posts = new XMLHttpRequest()
posts.open('GET','/get_posts', true)
posts.onload = () => {
  const server_posts = JSON.parse(posts.responseText)
  console.log(server_posts)
  class Feed extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        profile_pic: server_posts.profile_pic,
        user: server_posts.username,
        posts: server_posts.response,
        page: 'feed',
      }
    }
    
    handleClick() {
      const text = document.querySelector('#new_post_text').value;
      if (text.length > 1) {
        
        const data = {author: this.state.user, text: text}
        // send that post to the server to save it
        const csrftoken = Cookies.get('csrftoken');
        const request = new XMLHttpRequest();
        request.open('POST', '/create_new_post', true);
        request.setRequestHeader('X-CSRFToken', csrftoken);
        request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        request.onload = () => {
          const response = JSON.parse(request.responseText)
          console.log(response)
          this.setState({
            posts : [{likes: [], dislikes: [], author: response.author, author_picture: this.state.profile_pic, text: response.text, date: response.date, id:response.id, comments: response.comments}, ...this.state.posts]
          })
          document.querySelector("#new_post_text").value = '';
          console.log(response)
        }
        request.send(JSON.stringify(data))
      }
    }
  
    deletePost(post_id, author) {
      const post = document.getElementById(post_id)
      post.style.animationPlayState = 'running';
      setTimeout(() =>{
        this.setState({
          posts: this.state.posts.filter(post => post.id != post_id)
        })
      }, 1000)
  
      // delete the post from the server
      const data = {'post_author': author, 'id': post_id}
      const csrftoken = Cookies.get('csrftoken');
      const request = new XMLHttpRequest();
      request.open('POST', '/delete_post', true);
      request.setRequestHeader('X-CSRFToken', csrftoken);
      request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      request.onload = () => {
        const response = JSON.parse(request.responseText);
                              
        console.log(response)
      }
      request.send(JSON.stringify(data))
    }
   
    render() {
      if(this.state.page === 'feed') {
        return (
          <div >
            <Post_generator 
              current_user={this.state.user}
              picture={this.state.profile_pic}
              onClick={() => this.handleClick()} />
  
            {this.state.posts.length ?  this.state.posts.map(post => <Post
              onClick={() => this.deletePost(post.id, post.author)} 
              key={post.id}
              id={post.id}
              post_id={post.id}
              current_user={this.state.user}
              user={post.author}
              profile_pic={post.author_picture}
              current_user_profile_pic={this.state.profile_pic}
              text={post.text}
              date={post.date}
              comments={post.comments}
              likes={post.likes}
              dislikes={post.dislikes}
            />): <p className="no_results_p">No posts here. Try to search for friends in the search box and add them as friends. You'll see posts appear over time!</p>}
          </div>
        )
      }
      if (this.state.page === 'profile'){
        return( 'profile')
      }  
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Feed />,
    document.getElementById('feed')
  );
  

}
posts.send()


// displays all of the users friends
const friends = new XMLHttpRequest()
friends.open('GET', '/get_friends', true)
friends.onload = () => {
  const response = JSON.parse(friends.responseText)
  console.log(response)
  class Friends extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        friends: response.response
      }
      this.hello = this.hello.bind(this)
    }

    hello(user){
      var now = new Date()
      now.toUTCString()
      now = now.toString()
      now = now.substring(0, now.length -33)
      var friends = this.state.friends
      for (let i = 0; i < friends.length; i ++){
        if (friends[i]['user'] === user){
          friends[i].last_message_date = now
        }
      }
      this.setState({friends: friends})
      console.log(now)
    }

    message(friend, profile_pic) {
      document.getElementById('message_box').style.display = 'block';
     
      // get friendship id for chatSocket
      const data = {sender: response.user, receiver: friend}
      const friendship = new XMLHttpRequest()
      const csrftoken = Cookies.get('csrftoken');
      friendship.open("POST", "/friendship_id", true)
      friendship.setRequestHeader('X-CSRFToken',csrftoken);
      friendship.setRequestHeader('Content-Type', "text/plain;charset=UTF-8");
      friendship.onload = () => {
        const answer = JSON.parse(friendship.responseText)
        const friendship_id = answer.id
        const messages_from_server = answer.messages
        console.log(answer.id)
        console.log(messages_from_server)

      // create messaging appnew ReconnectingWebSocket
      var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
      const chatSocket = new WebSocket(
        ws_scheme
        + '://'
        + window.location.host
        + '/wss/chat/'
        + friendship_id
        + '/'
      );
      console.log(chatSocket)
      

      class Message_app extends React.Component {
        constructor(props) {
          super(props)
          this.state = {
            messages: messages_from_server,
            receiver: friend,
            receiver_pic: profile_pic,
            user: response.user,
          }
        }
        
        componentDidMount() {
         
          chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log(data)
            this.setState({
              messages: [...this.state.messages, {'text': data.message, 'sender': data.sender, 'receiver':data.receiver, 'id': data.id}]
            })
          }
          document.querySelector('#message_text').onkeyup = function (e) {
            if (e.keyCode === 13) {
              document.querySelector("#send_message_button").click() 
            }
          }  
        }
        
        sendMessage() {
          
          const message = document.querySelector("#message_text").value;
          //send the message via the chatsocket
          if (message.length > 0){
            chatSocket.send(JSON.stringify({
              message: message,
              sender: this.state.user,
              receiver: this.state.receiver
            }));
            document.querySelector("#message_text").value = '';
            this.props.greet(this.state.receiver)
          }
        }

        close() {
          document.getElementById('message_box').style.display = 'none';
        }

        render() {
          return(
            <div className='inner_container'>
            <Top_bar
              user={this.state.receiver}
              profile_pic={this.state.receiver_pic}
              close={() => this.close()}
            />
            <Message_screen 
              messages={this.state.messages}
              current_user={this.state.user}
            />
            <Compose_message 
              send={() => this.sendMessage()}
            />
            </div>
          )
        }
      }
      ReactDOM.render(
        <Message_app 
        greet={(user) => this.hello(user)}/>, document.getElementById('message_box')

      )

      }
      friendship.send(JSON.stringify(data))

      
    }
    render() {
      return (
        <div>
          {this.state.friends.length ? this.state.friends.map(friend => <Friend_box
            key={friend.id}
            name={friend.user}
            profile_pic={friend.profile_pic}
            friend={friend.id}
            message={() => this.message(friend.user, friend.profile_pic)}
            last_contact={friend.last_message_date}
          />): <p className='no_results_p'>Uh Oh! You don't have any Friends yet.
          Try to add them via the search box and they will appear here when they accept your friend request.</p>}
        </div>
        )
      }
    }

  ReactDOM.render(
    <Friends />, 
    document.getElementById('friendship_div')
  )
}
friends.send()



// get all the necessasry info from the server 1) friend_requests 2) posts 3) friends

// create the App class 

