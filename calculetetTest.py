# def uniswap_amm(x, y, k, amount):
#     """
#     Tính toán số lượng token Y trả về khi đưa thêm một lượng token X vào Uniswap liquidity pool.
    
#     Arguments:
#     x -- Số lượng token 1 trong liquidity pool trước khi thêm token X
#     y -- Số lượng token 2 trong liquidity pool trước khi thêm token X
#     k -- Hằng số K của công thức Uniswap AMM
    
#     Returns:
#     Số lượng token Y trả về khi đưa thêm token X vào liquidity pool
#     """
#     return y - k / (x + amount) 

# # Sử dụng ví dụ với X = 10, Y = 20, K = 100
# x = 100
# y = 50
# k = 100*100

# # Tính toán số lượng token Y trả về
# token_y_returned = uniswap_amm(x, y, k, 1200)
# print("Số lượng token Y trả về:", token_y_returned)



def stable_swap(x, y, n, a):
    """
    Tính toán số lượng token Y trả về khi đưa thêm một lượng token X vào StableSwap liquidity pool.
    
    Arguments:
    x -- Số lượng stablecoin 1 trong liquidity pool trước khi thêm token X
    y -- Số lượng stablecoin 2 trong liquidity pool trước khi thêm token X
    n -- Tổng số lượng stablecoin trong liquidity pool
    a -- Hằng số A của công thức StableSwap
    
    Returns:
    Số lượng token Y trả về khi đưa thêm token X vào liquidity pool
    """
    return (n**(2*a) * y - x**(a+1))**(1/(2*a))

# Sử dụng ví dụ với X = 10, Y = 20, N = 100 và A = 2
x = 10
y = 20
n = 100
a = 2

# Tính toán số lượng token Y trả về
token_y_returned = stable_swap(x, y, n, a)
print("Số lượng token Y trả về:", token_y_returned)
