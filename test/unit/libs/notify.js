import test from 'ava';
import NotifyCore from 'app/libs/notify-core';

test(`Can register group`, t => {
	const Notify = new NotifyCore();
	Notify.registerGroups({
		groupX1: {
			id: 'myGroupId1'
		}
	});
	t.true(Notify.groupExists('groupX1'));
});

test(`Can register action`, t => {
	const Notify = new NotifyCore();
	Notify.registerGroups({
		groupX2: {
			id: 'myGroupId2'
		}
	});

	Notify.registerActions({
		actionY2: {
			group: 'groupX2',
			request: () => {},
			notify: () => {},
			stopCondition: () => true
		}
	});
	t.true(Notify.actionExists('actionY2'));
});

// test.todo(`Can't register action with unknown group`);

// test.todo(`Can watch group`);

// test.todo(`Can't watch unknown group`);

test.cb(`Can start action`, t => {
	t.plan(3);
	let counter = 0;
	const Notify = new NotifyCore();
	Notify.registerGroups({
		groupX3: {
			id: 'myGroupId3'
		}
	});

	Notify.registerActions({
		actionY3: {
			group: 'groupX3',
			request: actionInfo => Promise.resolve(actionInfo),
			notify: (actionInfo, response) => {
				counter++;
				t.is(counter, 1);
				t.is(response.myGroupId, actionInfo.myGroupId);
				t.is(response.otherInfo, actionInfo.otherInfo);
				t.end();
			},
			stopCondition: () => true
		}
	});

	Notify.watchGroupX3({myGroupId3: 'groupId3'});
	Notify.startActionY3({myGroupId3: 'groupId3', otherInfo: 'toto'});
});

test.cb(`Skip action when not watching group`, t => {
	// t.plan(3);
	let counter = 0;
	const Notify = new NotifyCore();
	Notify.registerGroups({
		groupX4: {
			id: 'myGroupId4'
		}
	});

	const failTest = () => {
		counter++;
		t.fail();
		t.end();
	};

	Notify.registerActions({
		actionY4: {
			group: 'groupX4',
			request: actionInfo => {
				failTest();
				return Promise.resolve(actionInfo);
			},
			notify: failTest,
			stopCondition: failTest
		}
	});

	Notify.startActionY4({myGroupId4: 'groupId4', otherInfo: 'toto'});

	setTimeout(() => {
		t.is(counter, 0);
		t.end();
	}, 100);
});

test.cb(`Can stop action when clear group`, t => {
	t.plan(4);
	let counter = 0;
	const Notify = new NotifyCore();
	Notify.registerGroups({
		groupX5: {
			id: 'myGroupId5'
		}
	});

	Notify.registerActions({
		actionY5: {
			group: 'groupX5',
			request: actionInfo => {
				return new Promise(resolve => {
					setTimeout(() => {
						resolve(actionInfo);
					}, 500);
				});
			},
			notify: (actionInfo, response) => {
				counter++;
				t.is(counter, 1);
				t.is(response.myGroupId, actionInfo.myGroupId);
				t.is(response.otherInfo, actionInfo.otherInfo);
			},
			stopCondition: () => false
		}
	});

	Notify.watchGroupX5({myGroupId5: 'groupId5'});
	Notify.startActionY5({myGroupId5: 'groupId5', otherInfo: 'toto'});

	setTimeout(() => {
		Notify.clearGroupX5({myGroupId5: 'groupId5'});
	}, 200);

	setTimeout(() => {
		t.is(counter, 1);
		t.end();
	}, 2000);
});

test.cb(`Ignores multiple start action (call once at most)`, t => {
	t.plan(4);
	let counter = 0;
	const Notify = new NotifyCore();
	Notify.registerGroups({
		groupX6: {
			id: 'myGroupId6'
		}
	});

	Notify.registerActions({
		actionY6: {
			group: 'groupX6',
			request: () => Promise.resolve({x: Math.random(), y: 123}),
			notify: (actionInfo, response) => {
				counter++;
				t.is(response.y, 123);
			},
			stopCondition: () => false
		}
	});

	Notify.watchGroupX6({myGroupId6: 'groupId6'});
	Notify.startActionY6({myGroupId6: 'groupId6', otherInfo: 'toto'});
	Notify.startActionY6({myGroupId6: 'groupId6', otherInfo: 'toto'});
	Notify.startActionY6({myGroupId6: 'groupId6', otherInfo: 'toto'});
	Notify.startActionY6({myGroupId6: 'groupId6', otherInfo: 'toto'});
	setTimeout(() => {
		t.is(counter, 3);
		t.end();
	}, 13000);
});

test.cb(`Call multiple start action with same group but different id`, t => {
	let counter = 0;
	const Notify = new NotifyCore();
	Notify.registerGroups({
		groupX7: {
			id: 'myGroupId7'
		}
	});

	Notify.registerActions({
		actionY7: {
			group: 'groupX7',
			id: 'specifId7',
			request: () => Promise.resolve({x: Math.random(), y: 123}),
			notify: (actionInfo, response) => {
				counter++;
				t.is(response.y, 123);
			},
			stopCondition: () => false
		}
	});

	Notify.watchGroupX7({myGroupId7: 'groupId7'});
	Notify.startActionY7({myGroupId7: 'groupId7', specifId7: 'specifId7-1', otherInfo: 'toto'}); // Should call !
	Notify.startActionY7({myGroupId7: 'groupId7', specifId7: 'specifId7-2', otherInfo: 'toto'}); // Should call !
	Notify.startActionY7({myGroupId7: 'groupId7', specifId7: 'specifId7-1', otherInfo: 'toto'}); // Should not call
	Notify.startActionY7({myGroupId7: 'groupId7', specifId7: 'specifId7-1', otherInfo: 'toto'}); // Should not call
	setTimeout(() => {
		t.is(counter, 6);
		t.end();
	}, 13000);
});

test.cb(`Call stop action only on same group id, not all the actions of group`, t => {
	const g1 = 'groupId8-1';
	const g2 = 'groupId8-2';
	const counter = {};
	counter[g1] = 0;
	counter[g2] = 0;
	const Notify = new NotifyCore();
	Notify.registerGroups({
		groupX8: {
			id: 'myGroupId8'
		}
	});

	Notify.registerActions({
		actionY8: {
			group: 'groupX8',
			request: () => Promise.resolve({x: Math.random(), y: 123}),
			notify: (actionInfo, response) => {
				counter[actionInfo.myGroupId8]++;
				t.is(response.y, 123);
			},
			stopCondition: () => false
		}
	});

	Notify.watchGroupX8({myGroupId8: g1});
	Notify.watchGroupX8({myGroupId8: g2});
	Notify.startActionY8({myGroupId8: g1, otherInfo: 'toto'}); // Should call one time! at 0 sec
	Notify.startActionY8({myGroupId8: g2, otherInfo: 'toto'}); // Should call two times! at 0 and 5 sec

	setTimeout(() => {
		Notify.clearGroupX8({myGroupId8: g1});
	}, 200);

	setTimeout(() => {
		t.is(counter[g1], 1);
		t.is(counter[g2], 2);
		t.end();
	}, 6000);
});
