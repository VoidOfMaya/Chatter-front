import { Link } from "react-router-dom"

const NotFound =()=>{
    return(
        <div
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >

            <h1>ERROR:404 Page not found </h1>
            <p> if page isnt redirected to home,<Link to={'/'}> click here</Link></p>
        </div>
    )
}
export{
    NotFound
}