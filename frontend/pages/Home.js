import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert,Image } from 'react-native'
import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import { usercontext } from '../context/authContext'
import API from '../config'

const Home = () => {
  const { setProduct, accessToken, product, user, logout } = useContext(usercontext)

  const getProduct = async () => {
    if (!accessToken) return  // Guard: don't fetch without token

    try {
      const res = await axios.get(
        `${API.PRODUCT_URL}/getproduct`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      )
      setProduct(res.data.products)
    } catch (error) {
      console.log('Error fetching products:', error.response?.status, error.message)
      if (error.response?.status === 401) {
        // Token expired or invalid — clear it and force re-login
        await logout()
      } else {
        Alert.alert('Error', 'Failed to load products')
      }
    }
  }

  useEffect(() => {
    getProduct()
  }, [accessToken])

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ])
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.username || 'User'} 👋
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={product}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.productName}>{item.product_name}</Text>
       <Image
  source={{
    uri: item?.image_url 
      ? item.image_url 
      : "https://via.placeholder.com/100"
  }}
  style={{width:100,height:100}}
/>
            <Text style={styles.productPrice}>${item.price}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found.</Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  productPrice: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 15,
    marginTop: 60,
  },
})

export default Home