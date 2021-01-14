import React, {Component} from 'react';
import DashUserNav from '../../components/DashUserNav/DashUserNav';
import BookUtils from '../../components/BookUtils/BookUtils';
import BookDisplay from '../../components/BookDisplay/BookDisplay';
import Modal from '../../components/UI/Modal/Modal';
import FullBookDisplay from '../../components/FullBookDisplay/FullBookDisplay';
import axios from 'axios';

class Dashboard extends Component {
  
  state = {
    name:'',
    //self
    genres:[],
    loading: false,
    
    //bookdisplay
    books: [],
    notfound: false,
    showBook: false,
    showingBook: null,  

    //sort
    asc: false,

    //filter
    filterName:'',
    filterAuthor:'',
    filterUploader:'',
    filterGenres:[],

    editBook: false,
    newTitle: '',
    newAuthor: ''
  }

  async componentDidMount() {
    this.setState({loading: true});
    try {
      const res = await axios.get('/api/genres');
      const res2 = await axios.get('/api/books');
      const res3 = await axios.get('/api/user/me');
      this.setState({genres: res.data, loading: false, books: res2.data, name: res3.data.name});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }
  }

  // changes filtering state vars
  onChangeHandler = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  }
  
  //changes filtering genres
  onSelect = (selectedList, selectedItem) => {
    this.setState({filterGenres: selectedList});
  }
  
  //changes filtering genres
  onRemove = (selectedList, removedItem) => {
    this.setState({filterGenres: selectedList});
  }
  
  // get response of new filtered books
  filterBooksHandler = (books) => {
    if(books.length === 0) {
      this.setState({notfound: true});
    }
    else
      this.setState({books: books, notfound: false});
  }
  
  // changes sorting order in state
  sortBooksHandler = () => {
    this.setState({asc:!this.state.asc});
  }
  
  // gets and shows the selected book
  showBookHandler = async (id) => {
    this.setState({showBook: true});
    try {
      const res = await axios.get('/api/books/'+id);
      this.setState({showingBook: res.data});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }
  }
  
  // hide the modal in both showing and editing mode
  hideBookHandler = () => {
    this.setState({showBook: false, editBook:false, showingBook:null});
  }

  // gets and edit the selected book
  editBookHandler = async (id) => {
    this.setState({editBook: true});
    try {
      const res = await axios.get('/api/books/'+id);
      this.setState({showingBook: res.data, newTitle:res.data.title, newAuthor:res.data.author});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }
  }

  changeBookHandler = async(id) => {
    const payload = {
      newTitle: this.state.newTitle,
      newAuthor: this.state.newAuthor
    }
    try {
      await axios.put('/api/books/'+id, payload);
      alert('Book Edited Successfully');
      this.setState({showingBook: null, newTitle: '', newAuthor: ''});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }
  }

  deleteBookHandler = async(id) => {
    try {
      await axios.delete('/api/books/'+id);
      alert('Book Deleted Successfully');
      this.setState({showingBook: null, newTitle: '', newAuthor: ''});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }
  }

  // download = async() => {
  //   fetch('api/checking')
	// 		.then(response => {
  //       console.log(response.body);
	// 			response.blob().then(blob => {
	// 				let url = window.URL.createObjectURL(blob);
	// 				let a = document.createElement('a');
	// 				a.href = url;
	// 				a.download = 'employees.pdf';
	// 				a.click();
	// 			});
	// 			//window.location.href = response.url;
	// 	});
  // }

  render() { 
    let screen;
    if(this.state.loading) {
      screen = <h1 className="text-center mt-5">Loading...</h1>;
    }

    else {
      screen = (
          <div className='container' style={{maxWidth:'100%'}}>
            <div className="row">
              <div className="col-sm-12 col-md-4">
                <BookUtils genres={this.state.genres} 
                          name={this.state.name}
                          page_id = '1'
                          filtered={(books) => this.filterBooksHandler(books)}
                          sorted={this.sortBooksHandler}
                          changed={this.onChangeHandler}
                          filterName={this.state.filterName}
                          filterAuthor={this.state.filterAuthor}
                          filterUploader={this.state.filterUploader}
                          filterGenres={this.state.filterGenres}
                          onSelect={(a, b) => this.onSelect(a, b)}
                          onRemove={(a, b) => this.onRemove(a, b)}/>
              </div>
              <div className="col-sm-12 col-md-8 mt-3"  style={{height:'550px', overflow: 'auto'}}>
                <BookDisplay 
                        books={this.state.books} 
                        notfound={this.state.notfound} 
                        asc={this.state.asc}
                        showBook={this.setState.showBook}
                        showBookHandler={(id) => this.showBookHandler(id)}
                        editBookHandler={(id) => this.editBookHandler(id)}/>
              </div>
            </div>
            <Modal show={this.state.showBook || this.state.editBook} modalClosed={this.hideBookHandler}>
              <FullBookDisplay 
                        showingBook={this.state.showingBook} 
                        show={this.state.showBook}
                        onChange={this.onChangeHandler}
                        changeBook={this.changeBookHandler}
                        deleteBook={this.deleteBookHandler}/>
            </Modal>
          </div>
        );
    }
    return (
      <React.Fragment>
        <DashUserNav />
        {/* <button onClick={this.download}>Download</button> */}
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

export default Dashboard;