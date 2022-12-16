import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, TouchableHighlight, RefreshControl } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from "../../api"
import { StatusBar } from 'expo-status-bar';
import { BarCodeScanner } from 'expo-barcode-scanner';


export default function Product({ route }) {

    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);
    const [selectedProd, setSelectedProd] = useState(null);
    const [stock, setStock] = useState('');
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(7);
    const [isLoading, setIsLoading] = useState(false);
    const [preCodeBar, setPreCodeBar] = useState('')
    const [visible, setVisible] = useState(false)
    //Code Bar
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [codeBar, setCodeBar] = useState('**')

    const [allProducts, setAllProducts] = useState([]);
    const [filterProduct, setFilterProduct] = useState([]);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            getProducts()
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, [])

    useEffect(() => {
        searchProd(search)
    }, [search])


    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        setVisible(false);
        searchProd(data);
    };

    const disableLoad = () => {
        setIsLoading(false)
    }

    const enableLoad = async () => {
        setIsLoading(true)
        return true
    }

    const getProducts = async () => {
        const service = (await api())
        enableLoad()
        service.get('product')
            .then(res => {
                if (res) {
                    setAllProducts(res.data.filter((a, i) => i > -1))
                    setFilterProduct(res.data.filter((a, i) => i > -1))
                    console.log(res.data)
                    disableLoad()
                }
            }).catch(err => {
                console.log(err)
                setIsLoading(false)
            })
    }

    const changeStock = async (item) => {

        (await api()).put(`product/edit/${item.id}`, { stock }).then(
            res => {
                setStock(null)
                setModal(!modal)
                if (res) {
                    if (res.data.message == 'success') {
                        getProducts()
                        alert('Estoque atualizado com sucesso!')
                    } else {
                        alert('Houve um problema ao tentar atualizar o estoque!')
                    }
                } else {
                    alert('Erro inesperado!')
                }
            }
        ).catch(err => {
            console.log(err)
        })

    }

    const showModal = (item) => {
        setModal(true)
        setSelectedProd(item)
    }

    const selectItem = () => {
        if (selectedProd) {
            changeStock(selectedProd)
        } else {
            alert('Produto não encontrado')
        }
    }

    const searchProd = (searchFill) => {
        if (!searchFill) {
            setFilterProduct(allProducts)
            return
        }
        let listProd = allProducts.filter(product => String(product.name).toUpperCase().indexOf(searchFill.toUpperCase()) > -1)
        if (!(listProd.length > 0)) {
            listProd = allProducts.filter(product => product.codebar == searchFill)
        }
        setFilterProduct(listProd.filter((a, i) => i > -1))
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    const updateProd = () => {
        setIsLoading(true)
        setLimit(limit + 5)
        setTimeout(() => { setIsLoading(false) }, 1000)
    }

    return (
        visible ?
            <View style={styles.container}>
                <StatusBar backgroundColor={'#0B72F3'} barStyle="light-content" />
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
            :
            <ScrollView
                keyboardShouldPersistTaps={"always"}
                refreshControl={<RefreshControl
                    refreshing={isLoading} />}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        updateProd()
                    }
                }}
                scrollEventThrottle={400}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modal}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TextInput style={styles.inputModal} value={stock} autoFocus={true} onChangeText={(estoque) => setStock(estoque)} keyboardType={"numeric"}></TextInput>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={() => selectItem()}
                            >
                                <Text style={styles.textStyle}>Alterar Estoque</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>

                <View style={styles.container}>
                    <View style={styles.search}>
                        <TextInput
                            value={search}
                            placeholder={'Busque seus produtos'}
                            onChangeText={(text) => setSearch(text)}
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={() => { setVisible(true) }} >
                            <MaterialCommunityIcons name="barcode-scan" size={32} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'scroll', justifyContent: 'center', }}>
                        {
                            filterProduct.slice(page * limit, page * limit + limit).map((product) => {
                                return (
                                    <TouchableOpacity onPress={() => showModal(product)}>
                                        <View style={styles.containerProducts}>
                                            <View style={styles.products}>
                                                <Text style={{ top: 20, display: 'flex', maxWidth: '75%', fontWeight: 'bold' }}>
                                                    {product.name}
                                                </Text>
                                                <View style={{ display: 'flex', alignItems: 'flex-end', bottom: 10 }}>
                                                    <Text>Preço: {product.price}</Text>
                                                    <Text>Estoque Atual: {product.stock}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>

            </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: 'white',
        justifyContent: 'center',
        padding: 10,
        width: '100%',
        height: '100%',

    },
    search: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    input: {
        width: '90%',
        height: 50,
        padding: 10,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 50,
        elevation: 4
    },
    containerProducts: {
        marginTop: 30,
        marginRight: 5,
        backgroundColor: '#FAF4F4',
        width: '100%',
        height: 80,
        display: 'flex',
        borderBottomWidth: 3,
        borderLeftWidth: 2,
        borderRadius: 10,
        borderColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    products: {
        width: '100%',
        padding: 5,
        display: 'flex',
        justifyContent: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        padding: 5,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        width: '50%',
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        marginTop: 20,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    inputModal: {
        width: '90%',
        height: 35,
        padding: 0,
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: 'white',
        borderRadius: 50,
        elevation: 4
    }
});