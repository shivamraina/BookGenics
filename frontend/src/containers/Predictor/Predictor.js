import React, { Component } from "react";
import DashUserNav from '../../components/DashUserNav/DashUserNav';
import axios from "axios";

function getListOfGenres(str) {
  let ans = [];
  for(let i=0;i<str.length;i++) {
    if(str[i] === '\''){
      let f = i+1;
      let s = f;
      while(s<str.length && str[s] !== '\'') {
        s++;
      }
      ans.push(str.substring(f, s));
      i = s;
    }
  }
  return ans;
}

let titleCase = (str) => {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
};

class Predictor extends Component {

  state = {
    name: '',
    loading: false,
    res: [],
    content: '',
    selectedFile: null,
    title: '',
    author:''
  }

  async componentDidMount() {
    this.setState({loading: true});
    try{
      const res = await axios.get('/api/user/me');
      this.setState({name: res.data.name, loading: false});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }
  }

  onFileChange = event => { 
    this.setState({ selectedFile: event.target.files[0] });    
  };

  onSubmit = async (e) => {

    this.setState({loading: true});
    e.preventDefault();
    
    let formData = new FormData(); 
    formData.append( 
      "file", 
      this.state.selectedFile
    );

    try {
      let res = await axios.post('/api/prediction', formData);
      let rest = getListOfGenres(res.data.ans);
      this.setState({loading: false, res: rest, content: res.data.content});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }
  }

  onChange = (e) => {
    this.setState({[e.target.id] : e.target.value});
  }

  addBookHandler = async (e) => {
    e.preventDefault();
    this.setState({loading: true});
    const payload = {
      title: this.state.title,
      author: this.state.author,
      genres: this.state.res,
      content: this.state.content
    }
    try{
      await axios.post('/api/books', payload);
      alert('Book has been added');
      this.setState({loading: false});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }

  }

  render() {
    let screen = null;

    if(this.state.loading) {
      screen =  <div className='container'>
                  <div className='d-flex justify-content-center p-2 m-3'>
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <div className="mx-3">
                      <p><b>Please wait for some time.</b></p>
                    </div>
                  </div>
                </div>
    }

    if(!this.state.loading && this.state.res.length>0) {
      screen =<div>  
                <div className='d-flex justify-content-center container mt-3 p-2'>
                  <div className='row'>
                    <div className='col-sm-12 mr-auto'>
                      <div className='border border-success p-3' style={{borderRadius: '25px', backgroundColor:'gray'}}>
                        <h2 className='text-center' style={{textDecoration:'underline', color:'black'}}><b>Your Genres</b></h2>
                        {this.state.res.map((gen,i) => (
                          <h3 className='text-center' style={{color:'black'}} key={i}>{titleCase(gen)}</h3>
                        ))}
                      </div>
                      <button className='btn btn-danger mt-2 ml-5' data-toggle="modal" data-target="#exampleModal">ADD BOOK</button>
                    </div>
                  </div>
                </div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">  
                        <h5 className="modal-title" id="exampleModalLabel">Enter Details of Book</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="form-group">
                            <label htmlFor="title">Enter Title of Book</label>
                            <input type="text" className="form-control" id="title" onChange={this.onChange}/>
                          </div>
                          <div className="form-group">
                            <label htmlFor="author">Enter name of the Author</label>
                            <input type="text" className="form-control" id="author" onChange={this.onChange}/>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.addBookHandler}>Add Book</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
    }

    return (
      <React.Fragment>
        <DashUserNav />
        <div className="container mt-4 mb-4">
          <div className="row mt-4">
            <h4>
              <strong>Welcome, {this.state.name} </strong>
            </h4>
          </div>
          <div className="container border border-success" style={{backgroundColor: 'white'}}>
            <div className='container p-3'>
              <div className='form-group'>
                <label htmlFor="userfile" className='lead'>Upload Only the Story of your File</label>
              </div>
              <div className='form-group border p-3'>
                <input type="file" id='userfile' name="userfile" onChange={this.onFileChange} required />
              </div>
              <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
            </div>
          </div>
        </div>
        {screen}
        <footer className="page-footer fixed-bottom" style={{backgroundColor: '#00695c', height:'25px'}}>
          <div className="footer-copyright text-center">
            <p style={{color:'white'}}>© 2020 Copyright: Developed Through Love</p>
          </div>	
        </footer>
      </React.Fragment>
    );
  }
}


export default Predictor;
