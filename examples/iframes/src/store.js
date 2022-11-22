/**
 * get id of worker from url get params
 */
var url = new URL(self.location.href);
var id = url.searchParams.get('id');

export default class Store {
	/**
	 * @param {!string} name Database name
	 * @param {function()} [callback] Called when the Store is ready
	 */
	constructor(name, callback) {
		/**
		 * @type {ItemList}
		 */
		let liveTodos;

		/**
		 * @type {Channel}
		 */
        window.tangle.listen('todos', (todos) => {
            liveTodos = todos;
        });

		/**
		 * Read the local ItemList from the shared state
		 *
		 * @returns {ItemList} Current array of todos
		 */
		this.getLocalStorage = () => {
			return liveTodos || window.tangle.state.todos;
		};

		/**
		 * Broadcast the local ItemList to other iFrames
		 *
		 * @param {ItemList} todos Array of todos to write
		 */
		this.setLocalStorage = (todos) => {
			window.tangle.broadcast({ todos });
            window.tangle.emit('lastUpdatedBy', id);
		};

		if (callback) {
			callback();
		}
	}

	/**
	 * Find items with properties matching those on query.
	 *
	 * @param {ItemQuery} query Query to match
	 * @param {function(ItemList)} callback Called when the query is done
	 *
	 * @example
	 * db.find({completed: true}, data => {
	 *	 // data shall contain items whose completed properties are true
	 * })
	 */
	find(query, callback) {
		const todos = this.getLocalStorage();
		let k;

		callback(todos.filter(todo => {
			for (k in query) {
				if (query[k] !== todo[k]) {
					return false;
				}
			}
			return true;
		}));
	}

	/**
	 * Update an item in the Store.
	 *
	 * @param {ItemUpdate} update Record with an id and a property to update
	 * @param {function()} [callback] Called when partialRecord is applied
	 */
	update(update, callback) {
		const id = update.id;
		const todos = this.getLocalStorage();
		let i = todos.length;
		let k;

		while (i--) {
			if (todos[i].id === id) {
				for (k in update) {
					todos[i][k] = update[k];
				}
				break;
			}
		}

		this.setLocalStorage(todos);

		if (callback) {
			callback();
		}
	}

	/**
	 * Insert an item into the Store.
	 *
	 * @param {Item} item Item to insert
	 * @param {function()} [callback] Called when item is inserted
	 */
	insert(item, callback) {
		const todos = this.getLocalStorage();
		todos.push(item);
		this.setLocalStorage(todos);

		if (callback) {
			callback();
		}
	}

	/**
	 * Remove items from the Store based on a query.
	 *
	 * @param {ItemQuery} query Query matching the items to remove
	 * @param {function(ItemList)|function()} [callback] Called when records matching query are removed
	 */
	remove(query, callback) {
		let k;

		const todos = this.getLocalStorage().filter(todo => {
			for (k in query) {
				if (query[k] !== todo[k]) {
					return true;
				}
			}
			return false;
		});

		this.setLocalStorage(todos);

		if (callback) {
			callback(todos);
		}
	}

	/**
	 * Count total, active, and completed todos.
	 *
	 * @param {function(number, number, number)} callback Called when the count is completed
	 */
	count(callback) {
		this.find(undefined, data => {
			const total = data.length;

			let i = total;
			let completed = 0;

			while (i--) {
				completed += data[i].completed;
			}
			callback(total, total - completed, completed);
		});
	}
}
