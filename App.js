import React,{useState,useEffect} from'react';
import './App.css';
import Posts from './Posts';
import { db,auth} from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImgUpload from './ImgUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
 
function App() {
  const classes =useStyles([]);
  const[modalStyle]=useState(getModalStyle);
  // eslint-disable-next-line
  const [posts, setPosts] =useState([]);
  const [open,setOpen]=useState(false);
  const[openSignIn,setOpenSignIn]=useState(false);
  const [username, setUsername] =useState('');
  const [password,setPassword]=useState('');
  const [email, setEmail] =useState('');
  const [user,setUser]=useState(null);

  useEffect(()=> {
   const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        console.log(authUser);
        setUser(authUser);
        }
      else{
        setUser(null);
      }
    })
return () => {
  unsubscribe();
}
  },[user,username]);


  useEffect( ()=> {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({ 
         id:doc.id,
         post:doc.data()})));
    })

  },[]);
  const signUp=(event)=>{
    event.preventDefault();
auth.createUserWithEmailAndPassword(email,password)
.then((authUser) =>{
  authUser.user.updateProfile({
    displayName:username
  })
})
.catch((error)=> alert( error.message));
setOpen(false);
  }

  const signIn=(event)=> {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
  .catch((error)=> alert(error.message))
  setOpenSignIn(false);
  }


  return (
    <div className="app">
       <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
    <div style={modalStyle} className={classes.paper}>
   <form className="app__signup">
       <center>
      <img 
      className="app__headerImage" 
      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
      alt="" 
      />
       </center>

       <Input
      type="text"
      placeholder="username"
      value={username}
      onChange={(e)=> setUsername(e.target.value)}
      />
      <Input
      placeholder="email"
      type="text"
      value={email}
      onChange={(e)=> setEmail(e.target.value)}
      />
      <Input
      placeholder="password"
      type="password"
      value={password}
      onChange={(e)=> setPassword(e.target.value)}
      />
      <Button type="submit"  onClick={signUp}>Sign Up</Button>

      </form>

    
</div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      >
    <div style={modalStyle} className={classes.paper}>
   <form className="app__signup">
       <center>
      <img 
      className="app__headerImage" 
      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
      alt="" 
      />
       </center>
 
      <Input
      placeholder="email"
      type="text"
      value={email}
      onChange={(e)=> setEmail(e.target.value)}
      />
      <Input
      placeholder="password"
      type="password"
      value={password}
      onChange={(e)=> setPassword(e.target.value)}
      />
      <Button type="submit"  onClick={signIn}>Sign In</Button>

      </form>

    
</div>
      </Modal>
     
     <div className="app__header">
      <img 
      className="app__headerImage" 
      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
      alt="" 
      />
       {user ? (
       <Button onClick={ ()=> auth.signOut()}>Log Out</Button>
     ): (
       <div className="app__loginContainer">
      <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
      <Button onClick={() => setOpen(true)}>Sign Up</Button>
</div>
     )}
     </div>
     <div className="app__posts">
       <div className="app__postsLeft">
     {
         posts.map(({id,post}) =>( 
           <Posts key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
             ))
       }
       </div>
       <div className="app__postsRight">
        <InstagramEmbed
    url='https://instagr.am/p/Zw9o4/'
  clientAccessToken='123|456'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
       </div>
       </div>
      
  {user?.displayName ? (
        <ImgUpload username={user.displayName}/>
      ):(
        <h3>Login to Post</h3>
        )}


    
 </div>
  );
}

export default App;
