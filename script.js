/* eslint-disable react/no-multi-comp */
const root = document.querySelector('#root')
const { Component } = React
const { HashRouter, Route, Link, Switch} = ReactRouterDOM

const API = 'https://acme-users-api-rev.herokuapp.com/api/'

const fetchProducts = axios.get(`${API}products`).then(res => res.data)
const fetchCompanies = axios.get(`${API}companies`).then(res => res.data)
const fetchOfferings = axios.get(`${API}offerings`).then(res => res.data)

// const allProdInfo = Promise.all([fetchProducts, fetchCompanies, fetchOfferings]).then(res => {
  // const [products, companies, offerings] = res

  // const allInfoOffers = offerings.map( offer => {
  //   const newObj = {...offer}
  //   const findProdInfo = products.find(product => product.id === offer.productId )
  //   const findCompInfo = companies.find(company => company.id === offer.companyId )

  //   newObj['productName'] = findProdInfo.name
  //   newObj['productSuggestedPrice'] = findProdInfo.suggestedPrice
  //   newObj['companyName'] = findCompInfo.name

  //   return newObj
  // })

  // const HomePageAvgPrice = () => {
  //   let sumPrices = 0
  //   let totalSales = allInfoOffers.length

  //   allInfoOffers.forEach(elem => {sumPrices += elem.price})

  //   return (sumPrices / totalSales).toFixed(2)
  // }

  // const consolidatedProductInfo = products.map( product => {
  //   const newObj = {...product}
  //   newObj['lowestPrice'] = {
  //     companyId: '',
  //     companyName: '',
  //     price: Infinity
  //   }
  //   newObj['avgPrice'] = 0
  //   newObj['numberOfSales'] = 0
  //   newObj['totalSalesPrice'] = 0

  //   return newObj
  // })
  // .map(product => {
  //    allInfoOffers.forEach(elem => {
  //     if ((elem.productId === product.id) && (elem.price < product.lowestPrice.price)) {
  //       product.lowestPrice = {
  //         companyId: elem.companyId,
  //         companyName: elem.companyName,
  //         price: elem.price
  //       }
  //     }

  //     if (elem.productId === product.id) {
  //       product.numberOfSales++
  //       product.totalSalesPrice += elem.price
  //     }
  //   })


  //   product.avgPrice = product.totalSalesPrice / product.numberOfSales
  //   product.avgPrice = product.avgPrice.toFixed(2)

  //   return product
// })


class Products extends Component {
  render() {
    const {productInfo} = this.props
    return (
      <div>
        <h2>Products</h2>
          <div>
            {
              productInfo.map( (product, idx) => {
                return (
                  <div key = {idx}>
                  <div>
                    <h3>Product:</h3>{` ${product.name}`}
                  </div>
                  <div>
                    <h3>Suggested Price:</h3>{` ${product.suggestedPrice}.00`}
                  </div>
                  <div>
                    <h3>Average Price:</h3>{` ${product.avgPrice}`}
                  </div>
                  <div>
                    <h3>Lowest Price:</h3>{` ${product.lowestPrice.price} offered by ${product.lowestPrice.companyName}`}
                  </div>
                  <hr/>
                  </div>
                )
              })
            }
          </div>
      </div>
    )
  }
}

class Home extends Component {
  render() {
    const {productInfo, homePageAvgPrice} = this.props
    return(
      <div>
        <h2>Home</h2>
        <div>We have {productInfo.length} products with an average price of {homePageAvgPrice}</div>
      </div>
    )
  }
}

class Nav extends Component {
  render() {
    const { hash } = this.props
    return (
      <nav>
        <Link to='/'><div id='home' className={ hash === '#/' ? 'selected' : '' }>Home</div></Link>
        <Link to='/products'><div id='product' className={ hash === '#/products' ? 'selected' : '' }>Products</div></Link>
      </nav>
    )
  }
}

class App extends Component {
  constructor() {
    super()

    this.state = {
      allProdInfo: [],
      offeringDetails: [],
      homePageAvgPrice: 0
    }
  }

  componentDidMount() {
    Promise.all([fetchProducts, fetchCompanies, fetchOfferings]).then(res => {

      const [products, companies, offerings] = res

      const allInfoOffers = offerings.map( offer => {
        const newObj = {...offer}
        const findProdInfo = products.find(product => product.id === offer.productId )
        const findCompInfo = companies.find(company => company.id === offer.companyId )

        newObj['productName'] = findProdInfo.name
        newObj['productSuggestedPrice'] = findProdInfo.suggestedPrice
        newObj['companyName'] = findCompInfo.name

        return newObj
      })

      const HomePageAvgPrice = () => {
        let sumPrices = 0
        let totalSales = allInfoOffers.length

        allInfoOffers.forEach(elem => {sumPrices += elem.price})

        return (sumPrices / totalSales).toFixed(2)
      }

      const consolidatedProductInfo = products.map( product => {
        const newObj = {...product}
        newObj['lowestPrice'] = {
          companyId: '',
          companyName: '',
          price: Infinity
        }
        newObj['avgPrice'] = 0
        newObj['numberOfSales'] = 0
        newObj['totalSalesPrice'] = 0

        return newObj
      })
      .map(product => {
         allInfoOffers.forEach(elem => {
          if ((elem.productId === product.id) && (elem.price < product.lowestPrice.price)) {
            product.lowestPrice = {
              companyId: elem.companyId,
              companyName: elem.companyName,
              price: elem.price
            }
          }

          if (elem.productId === product.id) {
            product.numberOfSales++
            product.totalSalesPrice += elem.price
          }
        })


        product.avgPrice = product.totalSalesPrice / product.numberOfSales
        product.avgPrice = product.avgPrice.toFixed(2)

        return product
      })

      this.setState({allProdInfo: consolidatedProductInfo, offeringDetails: allInfoOffers, homePageAvgPrice: <HomePageAvgPrice />})
    })
  }

  render() {
    return (
      <HashRouter>
         <h1>Acme Product Average React</h1>
         <Route render={ () => <Nav hash={ window.location.hash }/> } />
         <Switch>
          <Route exact path={ '/' } render={ () => <Home  productInfo={ this.state.allProdInfo } offeringDetails={ this.state.offeringDetails } homePageAvgPrice={ this.state.homePageAvgPrice }/> }/>
          <Route path={ '/products' } render={ () => <Products productInfo={ this.state.allProdInfo }/> }/>
         </Switch>
      </HashRouter>
    )
  }
}

ReactDOM.render(<App />, root)
