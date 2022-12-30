const should = require('should')
const request = require('supertest');

const app = require('./index')

describe('GET /users는', () => {
    describe('성공시', () => {
        it('유저 객체를 담은 배열로 응답한다.', (done) => {
            request(app)
                .get('/users')
                .end((err, res) => {
                    console.log(res.body);
                    res.body.should.be.instanceOf(Array);
                    done();
                })
        }),
        it('최대 limit 갯수만큼 응답한다.', (done) => {
            request(app)
                .get('/users?limit=2')
                .end((err, res) => {
                    res.body.should.have.lengthOf(2);
                    done();
                })
        })
    }),

    describe('실패 시', () => {
        it('limit이 숫자 형이 아니면 400을 응답한다.', (done) => {
            request(app)
            .get('/users?limit=two')
            .expect(400)
            .end(done);
        })
    })
    
}),

describe('GET /users/:username은', () => {
    describe('성공 시', () => {
        it('조회한 유저 id를 반환한다.', (done) => {
            request(app)
            .get('/users/1')
            .expect(200)
            .end((err, res) => {
                const value = res.body;
                res.body.should.have.property('id', 1);
                done();
            })
        });
    });

    describe('실패 시', () => {
        it('id가 숫자가 아닐 경우 400으로 응답한다.', (done) => {
            request(app)
            .get('/users/one')
            .expect(400)
            .end(done);
        });

        it('id로 유저를 찾을 수 없는 경우 404로 응답한다.', (done) => {
            request(app)
            .get('/users/999')
            .expect(404)
            .end(done);
        })
    })
    
})

describe('DELETE /users/:id는', () => {
    describe('성공 시', () => {
        it('204를 반환한다.', (done) => {
            request(app)
            .delete('/users/4')
            .expect(204)
            .end(done);
        })
    });
    describe('실패 시', () => {

        it('id가 숫자가 아닐 경우 400으로 응답한다.', (done) => {
            request(app)
            .delete('/users/two')
            .expect(400)
            .end(done);
        });

        it('id가 존재하지 않는 경우 404로 응답한다.', (done) => {
            request(app)
            .delete('/users/999')
            .expect(404)
            .end(done);
        })
    })
})

describe('POST /users', () => {
    describe('성공 시', () => {
        let name = 'James';
        let body;
        before( done => {
            request(app)
                .post('/users')
                .send({name : name})
                .expect(201) 
                .end((err, res) => {
                    body = res.body;
                    done();
                })
        });

        it('생성된 유저 객체를 반환한다.', () => {
            body.should.have.property('id');
        })

        it('입력한 name을 반환한다.', () => {
            body.should.have.property('name', name);
        })
    });

    describe('실패 시', () => {
        it('name 파라미터 누락 시 400을 반환한다.', done => {
            request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end(done);
        });

        it('name이 중복일 경우 409를 반환한다.', done => {
                request(app)
                    .post('/users')
                    .send({ name : 'bek'})
                    .expect(409)
                    .end(done);
        });
    })

});

describe('PUT /usesr/:id는', () => {
    describe('성공 시', () => {
        it('변경된 정보를 응답한다.', done => {
            request(app)
                .put('/users/1')
                .send({name : 'alice2'})
                .expect(200)
                .end((err, res) => {
                    res.body.should.have.property('name', 'alice2');
                    done();
                })
        })
    });

    describe('실패 시', () => {
        it('정수가 아닌 id일 경우 400 응답', done => {
            request(app)
                .put('/users/one')
                .expect(400)
                .end(done);
        });

        it('name이 없을 경우 400 응답', done => {
            request(app)
                .put('/users/2')
                .send({})
                .expect(400)
                .end(done);
        });

        it('없는 유저일 경우 404 응답', done => {
            request(app)
                .put('/users/999')
                .send({name : 'test'})
                .expect(404)
                .end(done);
        });

        it ('이름이 중복일 경우 409 응답', done => {
            request(app)
                .put('/users/3')
                .send({name : 'chris'})
                .expect(409)
                .end(done);
        });
    })
})