module pixels::board {
    use sui::object::{new, uid_to_address};
    use sui::dynamic_object_field;
    use sui::transfer::{transfer, share_object, public_transfer};
    use sui::coin::{Coin, value};
    use sui::sui::SUI;

    const EInvalidCoord: u64 = 0;
    const EPaused: u64 = 1;
    const EInsufficientFunds: u64 = 2;

    public struct Board has key, store {
        id: UID,
        paused: bool,
        receiver: address,
        price: u64
    }

    public struct AdminCap has key, store {
        id: UID
    }

    public struct Quadrant has key, store {
        id: UID,
        quadrant_id: u8,
        board: vector<vector<u32>>
    }

    fun init(ctx: &mut TxContext) {
        let mut board = Board {
            id: new(ctx),
            paused: true,
            receiver: ctx.sender(),
            price: 100_000_000, // (0.1 SUI)
        };

        let mut i = 0;
        while (i < 4) {
            dynamic_object_field::add(
                &mut board.id,
                i,
                Quadrant {
                    id: new(ctx),
                    quadrant_id: i,
                    board: make_quadrant(200)
                }
            );
            i = i + 1;
        };

        share_object(board);
        transfer(
            AdminCap { id: new(ctx) },
            ctx.sender()
        )
    }

    fun make_row(length: u16) : vector<u32> {
        let mut row: vector<u32> = vector::empty();
        let mut i = 0;
        while (i < length) {
            row.push_back(4_294_967_295); // équivaut à #FFFFFFFF
            i = i + 1;
        };
        row
    }

    fun make_quadrant(length: u16): vector<vector<u32>> {
        let mut grid: vector<vector<u32>> = vector::empty();
        let mut i = 0;
        while (i < length) {
            grid.push_back(make_row(length));
            i = i + 1;
        };
        grid
    }

    fun get_quadrant_id(x: u64, y: u64): u8 {
        if(x < 200) {
            if(y < 200) 0 else 2
        } else {
            if(y < 200) 1 else 3
        }
    }

    public fun get_quadrants(board: &Board): vector<address> {
        let mut addresses = vector::empty<address>();

        let mut i = 0;
        while (i < 4) {
            addresses.push_back(uid_to_address(&dynamic_object_field::borrow<u8, Quadrant>(&board.id, i).id));
            i = i + 1;
        };
        addresses
    }

    public fun set_pixel(board: &mut Board, x: u64, y: u64, color: u32, payment: Coin<SUI>) {
        assert!(!board.paused, EPaused);
        assert!(x < 400 && y < 400, EInvalidCoord);
        assert!(value(&payment) >= board.price, EInsufficientFunds);

        public_transfer(payment, board.receiver);

        let quadrant_id = get_quadrant_id(x,y);
        let quadrant: &mut Quadrant = dynamic_object_field::borrow_mut(&mut board.id, quadrant_id);
        let pixel: &mut u32 = vector::borrow_mut(
            quadrant.board.borrow_mut(x % 200),
            y % 200
        );
        *pixel = color;
    }

    public fun set_pause(_: &AdminCap, board: &mut Board) {
        board.paused = !board.paused
    }

    public fun set_price(_: &AdminCap, board: &mut Board, new_price: u64) {
        board.price = new_price;
    }

    public fun set_receiver(_: &AdminCap, board: &mut Board, new_receiver: address) {
        board.receiver = new_receiver;
    }
}