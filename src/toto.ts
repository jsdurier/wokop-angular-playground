namespace Toto {
	export class Titi {

	}

	export interface ITutu {}
}

type ITata = Toto.ITutu;

const a: ITata = {

};

interface IToto extends ITata {

}
