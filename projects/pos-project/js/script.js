let products = [];
let cart = [];

//promises
let promise = new Promise((resolve, reject) => {
	let success = true;
	setTimeout(() =>{
		if(success){
			resolve("Data return successfully")
		} else {
			reject("Something wrong")
		}
	},2000)
});

promise
	.then(result => console.log(result))
	.catch(error => console.log(error));



fetch('https://dummyjson.com/products')
.then(res => res.json())
.then(
	data => {
		products = data.products;
		getCategories();
		showProducts(products)
	}
)
.catch(error => console.log(error));

function getCategories(){
	const categories = [...new 
		Set(products.map(p => p.category))];
	const catDiv = document.getElementById("categories");
	catDiv.innerHTML = `<button onclick='showProducts(products)'>All</button>`;
	categories.forEach(cat =>{
		catDiv.innerHTML += `<button onclick="filterCategory('${cat}')">${cat}</button>`
	});

	//console.log(categories);
}

function filterCategory(catname){
	const filtered = products.filter(p=> p.category === catname);
	showProducts(filtered);
}

function showProducts(list){
	var proDiv = document.getElementById("products");
	proDiv.innerHTML = '';
	list.forEach(p => {
		proDiv.innerHTML += `<div class='product'>
				<img src='${p.thumbnail}'>
				<h4>${p.title}</h4>
				<h4>${p.price}</h4>
			<button onclick='addToCart(${p.id})'>Add To cart</button>
				</div>`;
	})
}

function addToCart(id){
	const product = products.find(p => p.id === id);
	const item = cart.find(c => c.id === id);
	if(item){
		item.qty++;
	} else {
		cart.push({id,title : product.title, price: product.price, qty : 1})
	}
	renderCart();

}

function renderCart(){
	const cartBody = document.getElementById("cartBody");
	cartBody.innerHTML = '';
	let total = 0;
	cart.forEach(item => {
		total += item.price * item.qty;
		cartBody.innerHTML += `<tr>
							<td>${item.title}<td>
							<td>
							<button onclick='minusQty(${item.id})'>-</button>
							${item.qty}
							<button onclick='plusQty(${item.id})'>+</button>
							<td>
							<td>${item.price}<td>
							<td><button onclick='removeItem(${item.id})'>X</button>
						</tr>`;
	});
	document.getElementById("total").innerText = Math.round(total);
	localStorage.setItem("cart",JSON.stringify(cart))
	//console.log(JSON.stringify(cart));
}

function minusQty(id){
	let item = cart.find(c => c.id === id);
	item.qty--;
	if(item.qty <= 0){
		cart = cart.filter(c => c.id !== id);
	}
	saveCart();
	console.log(item);
}

function plusQty(id){
	let item = cart.find(c => c.id === id);
	item.qty++;
	saveCart();
}
function removeItem(id){
	let con = confirm("Are you sure want to delete?");
	if(con){
		cart = cart.filter(c => c.id !== id);
		saveCart();
	}
}

function saveCart(){
	localStorage.setItem("cart",JSON.stringify(cart));
	renderCart();

}

window.onload = () =>{
	const savedCart = localStorage.getItem("cart");
	if(savedCart){
		cart = JSON.parse(savedCart);
		renderCart();
	}
}



