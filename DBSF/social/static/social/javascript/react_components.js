class Post_generator extends React.Component {
  render() {
    return (
    <div className="new_post_div">
    <img className="post_author_pic" src={this.props.picture} alt="profile_pic" />
    <div>
      <textarea name="new_post_text" id="new_post_text" placeholder="Say something to your close firends"></textarea>
      <button onClick={() => this.props.onClick()} className='btn btn-primary'>&#10002;</button>
    </div>
  </div>
    )
  }
}



class Post_body extends React.Component {
  render() {
    return (
      <p className="post_body" >{this.props.text}</p>
    )
  }
}

function Post_author(props) { 
  if(props.current_user !== props.user){
    return ( 
      <div className="author_info_div">
        <img className='post_author_pic' src={props.picture}/>
        <div className='post_info'>
          <a href={props.user} className='post_author_user'>{props.user}</a>           
          <small className="post_date">{props.date}</small>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="author_info_div">
        <img className='post_author_pic' src={props.picture}/>
        <div className='post_info'>
          <a href='/profile' className='post_author_user'>{props.user}</a>           
          <small className="post_date">{props.date}</small>
        </div>
      </div>
    )
  }    
}



class Post extends React.Component {
 
  render() {
    if (this.props.current_user === this.props.user){
      return (
        <div id={this.props.post_id} className="post">
          <button onClick={() => this.props.delete()} className="delete_post_button">&#10006;</button>
          <Post_author 
            current_user={this.props.current_user}
            picture={this.props.profile_pic}
            user={this.props.user}
            date={this.props.date}
          />
          <Post_body text={this.props.text}/>
        </div>
      )
    }
    else {
      return (
        <div id={this.props.post_id} className="post">
          <Post_author 
            current_user={this.props.current_user}
            picture={this.props.profile_pic}
            user={this.props.user}
            date={this.props.date}
          />
          <Post_body text={this.props.text}/>
        </div>
      )
    }
  }
}