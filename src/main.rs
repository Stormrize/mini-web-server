use std::{
    fs,
    io::{self, BufRead, Write},
    net,
};

use web_server::ThreadPool;

fn main() {
    let thread_pool = ThreadPool::new(20);

    let listener = net::TcpListener::bind("127.0.0.1:7878").unwrap();
    for stream in listener.incoming() {
        let stream = stream.unwrap();
        thread_pool.execute(|| {
            handle_connection(stream);
        });
    }
    println!("Shutting down.");
}

fn handle_connection(mut stream: net::TcpStream) {
    let buf_reader = io::BufReader::new(&stream);

    let http_request = buf_reader.lines().next().unwrap().unwrap();

    let parts: Vec<&str> = http_request.split_whitespace().collect();

    if parts.len() < 2 {
        return;
    }

    let bytes = match parts[0] {
        "GET" => match handle_get(parts[1]) {
            Ok(bytes) => bytes,
            Err(_) => {
                let status_line = "HTTP/1.1 404 NOT FOUND";
                let filename = "static/404.html";
                let content_type = "text/html; charset=utf-8";
                let contents = fs::read_to_string(filename).unwrap();
                let length = contents.len();
                format!("{status_line}\r\nContent-Type: {content_type}\r\n Content-Length: {length}\r\n\r\n{contents}")
                    .into_bytes()
            }
        },
        _ => return,
    };

    stream.write_all(bytes.as_slice()).unwrap();

    println!("{:#?}", http_request);
}

fn handle_get(raw_path: &str) -> io::Result<Vec<u8>> {
    let path = raw_path.split('?').next().unwrap_or("/");
    let clean_path = path.trim_start_matches('/');

    let file_path = if clean_path.is_empty() {
        "static/index.html".to_string()
    } else {
        format!("static/{}", clean_path)
    };

    if file_path.contains("..") {
        return Err(io::Error::new(
            io::ErrorKind::PermissionDenied,
            "Access Denied",
        ));
    }

    let content_type = if file_path.ends_with(".html") {
        "text/html; charset=utf-8"
    } else if file_path.ends_with(".css") {
        "text/css"
    } else if file_path.ends_with(".js") {
        "text/javascript"
    } else if file_path.ends_with(".jpg") || file_path.ends_with(".jpeg") {
        "image/jpeg"
    } else if file_path.ends_with(".png") {
        "image/png"
    } else if file_path.ends_with(".svg") {
        "image/svg"
    } else {
        "application/octet-stream"
    };

    let content = fs::read(file_path)?;

    let status_line = "HTTP/1.1 200 OK";
    let length = content.len();

    let headers = format!(
        "{}\r\nContent-Type: {}\r\nContent-Length: {}\r\n\r\n",
        status_line, content_type, length
    );

    let mut response = headers.into_bytes();
    response.extend(content);

    Ok(response)
}
